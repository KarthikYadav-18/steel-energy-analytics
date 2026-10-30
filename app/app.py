"""
Steel Plant Energy Dashboard (Flask backend)

How to run:   python app/app.py      then open   http://127.0.0.1:5000
The Random Forest model saved by the notebook is loaded here and used by the website.
"""
import json
from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, jsonify, render_template, request, send_from_directory

ROOT = Path(__file__).resolve().parent.parent
app = Flask(__name__)

# load everything once when the server starts
RESULTS = json.loads((ROOT / "results" / "results.json").read_text())
MODEL = joblib.load(ROOT / "models" / "usage_model.joblib")
DATA = pd.read_csv(ROOT / "data" / "cleaned_steel_data.csv",
                   usecols=["usage_kwh", "hour", "month", "week_status", "load_type"])

HOURLY = DATA.pivot_table(index="hour", columns="week_status", values="usage_kwh", aggfunc="mean").round(2)
MONTHLY = DATA.groupby("month")["usage_kwh"].mean().round(2)
HOUR_AVG = DATA.groupby("hour")["usage_kwh"].mean()

# allowed values for each input of the predictor form
LIMITS = {
    "lag_reactive": (0, 100), "lead_reactive": (0, 30), "lag_pf": (0, 100), "lead_pf": (0, 100),
    "hour": (0, 23), "month": (1, 12), "day_of_week": (0, 6),
}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/graphs/<path:name>")
def graphs(name):
    # the graphs saved by the notebook
    return send_from_directory(ROOT / "visualizations", name)


@app.route("/api/overview")
def overview():
    o3 = RESULTS["o3"]
    return jsonify({
        "rows": RESULTS["clean_rows"],
        "total_mwh": round(RESULTS["usage_stats"]["total"] / 1000, 1),
        "peak_hour": o3["peak_hour"],
        "weekend_drop": round(RESULTS["o2"]["drop_pct"], 1),
        "best_model": RESULTS["o5"]["best"],
        "best_r2": RESULTS["o5"]["table"][0]["Test R2"],
    })


@app.route("/api/charts")
def charts():
    return jsonify({
        "hours": [int(h) for h in HOURLY.index],
        "weekday": HOURLY["Weekday"].tolist(),
        "weekend": HOURLY["Weekend"].tolist(),
        "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        "monthly": MONTHLY.tolist(),
        "load_counts": RESULTS["load_counts"],
    })


@app.route("/api/models")
def models():
    return jsonify({
        "models": [{"model": r["Model"], "r2": r["Test R2"], "rmse": r["RMSE"]} for r in RESULTS["o5"]["table"]],
        "best": RESULTS["o5"]["best"],
        "figures": RESULTS["figures"],
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    values = {}
    for name, (low, high) in LIMITS.items():
        try:
            number = float(data[name])
        except (KeyError, TypeError, ValueError):
            return jsonify(error=name + " is missing or not a number"), 400
        if not low <= number <= high:
            return jsonify(error=name + " must be between " + str(low) + " and " + str(high)), 400
        values[name] = number

    # build the same 10 columns that the model was trained on
    row = {
        "lag_reactive": values["lag_reactive"], "lead_reactive": values["lead_reactive"],
        "lag_pf": values["lag_pf"], "lead_pf": values["lead_pf"],
        "hour": int(values["hour"]), "month": int(values["month"]), "dow_num": int(values["day_of_week"]),
        "is_weekend": int(values["day_of_week"] >= 5),
        "total_reactive": values["lag_reactive"] + values["lead_reactive"],
        "avg_pf": (values["lag_pf"] + values["lead_pf"]) / 2,
    }
    usage = float(MODEL["model"].predict(pd.DataFrame([row])[MODEL["features"]])[0])
    typical = float(HOUR_AVG.loc[int(values["hour"])])
    return jsonify({
        "usage_kwh": round(max(usage, 0), 2),
        "typical_kwh": round(typical, 2),
        "difference_pct": round(100 * (usage - typical) / typical, 1),
    })


if __name__ == "__main__":
    app.run(debug=True)
