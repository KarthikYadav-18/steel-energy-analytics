# Steel Plant Electricity Usage Analysis and Prediction

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Completed-success)](https://github.com/KarthikYadav-18/steel-energy-analytics)

INT234 Predictive Analytics, CA2 project, Lovely Professional University.

This project analyzes 35,040 electricity readings from a steel plant collected every 15 minutes during 2018. It covers data cleaning, exploratory analysis, statistical testing, predictive modeling, and a lightweight Flask web application for interaction.

## Highlights
- 5 analytical objectives
- 10 visualizations
- 4 predictive models
- Flask web app with screenshots
- Report and execution guide included

## Business problem
The aim is to understand how electricity usage changes across different load conditions, weekdays vs weekends, hourly and monthly demand, and how plant variables such as reactive power and power factor relate to energy consumption. The project also predicts future usage using machine learning.

## Key results
- Weekend usage is about 65.1% lower than weekday usage.
- Best model: Random Forest
- Metrics: R² = 0.9996, MAE = 0.250 kWh, RMSE = 0.703 kWh.

## Project structure
- `data` – datasets
- `notebooks` – analysis notebook
- `visualizations` – graphs and plots
- `results` – outputs and metrics
- `models` – trained model artifact
- `app` – Flask web app
- `screenshots` – app screenshots
- `report` – project report
- `HOW_TO_RUN.md` – setup and execution instructions
- `EXPLAIN_EVERY_GRAPH.md` – graph explanations for viva

## Run the project
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Follow the instructions in [HOW_TO_RUN.md](HOW_TO_RUN.md).

## Dataset source
Steel Industry Energy Consumption dataset from UCI / Kaggle / Mendeley sources.

## License
This project is licensed under the [MIT License](LICENSE).
