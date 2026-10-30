# Steel Plant Electricity Usage Analysis and Prediction
INT234 Predictive Analytics, CA2 project, Lovely Professional University

The data has 35,040 electricity readings of a steel plant (every 15 minutes, year 2018). The project cleans the data, studies 5 objectives with 10 graphs, trains 4 models to predict the energy usage, and has a small Flask website.

To run it, read `HOW_TO_RUN.md`. To prepare for the viva, read `EXPLAIN_EVERY_GRAPH.md`.

## Objectives
1. Do Light, Medium and Maximum load use different energy? (ANOVA)
2. Do weekends use less energy than weekdays? (t-test)
3. Which are the busiest hours and months?
4. How are reactive power and power factor related to usage? (correlation)
5. Predict the usage with 4 models: Multiple Linear, Polynomial, Decision Tree, Random Forest

## Results
* Weekend usage is 65.1 percent lower than weekday usage.
* Best model: Random Forest (R2 = 0.9996, MAE = 0.250 kWh, RMSE = 0.703 kWh).

## Folders
`data` dataset | `notebooks` main notebook | `visualizations` 10 graphs | `results` numbers | `models` saved model | `app` Flask website | `screenshots` website pictures | `report` Word report

Dataset: Steel Industry Energy Consumption (UCI, Kaggle, Mendeley).
