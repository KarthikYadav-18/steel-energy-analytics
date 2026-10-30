# How to run this project in VS Code (step by step)

## What is what
| File or folder | What it is | How you use it |
|---|---|---|
| `notebooks/steel_energy_analysis.ipynb` | **The main project.** It cleans the data, makes all 10 graphs and trains the 4 models | Open it in VS Code and click **Run All** |
| `app/app.py` | The website (extra). It only SHOWS results | Run it in the terminal with `python app/app.py` |
| `visualizations/` | The 10 graphs saved as pictures | Already created, and created again when you run the notebook |
| `report/` | The Word report | Open in Microsoft Word |

**Important:** the graphs are created by the **notebook**, not by app.py. The website shows a few graphs in a small form, and the gallery at the bottom of the website shows all 10.

## One time setup
1. Install Python 3.10 or newer from python.org. Tick **Add Python to PATH** while installing.
2. Open VS Code. Go to Extensions (Ctrl+Shift+X) and install **Python** and **Jupyter** (both by Microsoft).
3. In VS Code click **File > Open Folder** and open the folder `steel-energy-analytics`.
4. Open a terminal in VS Code (**Terminal > New Terminal**) and run:
```
pip install -r requirements.txt
```

## Run the notebook (to get all the graphs)
1. In the left panel open `notebooks/steel_energy_analysis.ipynb`.
2. At the top right click **Select Kernel**, choose **Python Environments**, and pick the Python you installed.
3. Click **Run All** at the top. Wait about one minute.
4. Scroll down. Every graph appears **under the code cell that makes it**. There is a short text under each graph that explains it.
5. To run one cell only, click it and press **Shift + Enter**.

If you see `ModuleNotFoundError`, run `pip install -r requirements.txt` again in the terminal and restart the kernel (the Restart button at the top).

## Run the website
In the VS Code terminal:
```
python app/app.py
```
Then open http://127.0.0.1:5000 in your browser. Press Ctrl+C in the terminal to stop it.
The website needs the files in `models/` and `results/`. They are already included, and they are made again whenever you run the whole notebook.

## Where is the output saved?
* Graphs: `visualizations/fig01_...png` to `fig10_...png`
* Numbers used in the report: `results/results.json`, `results/model_results.csv`, `results/cleaning_log.csv`
* Cleaned data: `data/cleaned_steel_data.csv`
* Trained model: `models/usage_model.joblib`
