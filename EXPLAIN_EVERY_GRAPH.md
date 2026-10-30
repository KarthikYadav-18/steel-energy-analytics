# Explain every graph, test and model (for the presentation and viva)

## Is all this mandatory for the CA?
No. The CA instructions ask for: data cleaning (missing values, duplicates, inconsistent data), EDA, **at least 5 objectives**, suitable graphs, feature engineering, **at least 4 models** with a best model, performance measures, and conclusions. You do **not** need to cover the whole syllabus or make 25 graphs.
This version has exactly: 5 objectives, 10 graphs, 4 models and 2 statistical tests. That covers every point in the CA.

## Say this first (30 seconds)
"My dataset has the electricity readings of a steel plant, one reading every 15 minutes for the year 2018, so 35,040 rows. I cleaned the data, found and fixed a date problem, and studied five objectives with graphs. Then I trained four models to predict the energy usage. Random Forest was the best with R2 = 0.9996. I also made a small website using Flask."

---
## The 10 graphs

**Figure 1 - Box plots (cleaning).** *Shows:* where most values of each column lie. The box is the middle 50 percent of the data, the line inside is the median, the dots outside are outliers. *Found:* usage has many high dots. They are real busy periods of the plant, so I kept them. The two "lead" columns show many dots only because most of their values are exactly 0 or 100.
*They may ask:* "Why did you not remove the outliers?" - They are real values, not mistakes. Removing them would remove the busy periods I want to predict.

**Figure 2 - Distribution and load type counts (EDA).** *Shows:* left, how often each usage value occurs; right, number of readings in Light, Medium and Maximum load. *Found:* most readings have low usage, a few have very high usage. Light load is the biggest group (18,072 readings).
*They may ask:* "What does right skewed mean?" - Most values are small and a few big values pull the tail to the right. That is why the median (4.57) is smaller than the average (27.39).

**Figure 3 - Correlation heatmap (EDA).** *Shows:* how strongly every two columns are related, from -1 to +1. *Found:* usage and lag_reactive are strongly related (r = 0.90). Usage and CO2 are almost the same (r = 0.99).
*They may ask:* "Why did you not use CO2?" - CO2 is calculated from usage, so using it to predict usage is cheating (data leakage).

**Figure 4 - Usage by load type (Objective 1).** *Shows:* one box for Light, Medium and Maximum load. *Found:* the boxes go up from Light (8.63 kWh average) to Medium (38.45) to Maximum (59.27). ANOVA p-value is less than 0.001.
*They may ask:* "What is ANOVA?" - A test that checks whether the averages of 3 or more groups are the same. If p is below 0.05, at least one group is different.

**Figure 5 - Weekday vs weekend and usage by hour (Objectives 2 and 3).** *Shows:* left, average usage on weekdays and weekends; right, average usage in each hour. *Found:* weekend usage is 65.1 percent lower (33.62 vs 11.73 kWh). On weekdays usage is low at night, rises in the morning (busiest hour 9:00), falls suddenly at 12:00 (maybe the lunch break) and stays high till evening.
*They may ask:* "Which test did you use?" - Welch t-test for two groups (weekday and weekend). The p-value is below 0.05, so the difference is real.

**Figure 6 - Usage by month (Objective 3).** *Shows:* average usage of each month. *Found:* Jan is the highest (42.42 kWh), Dec is the lowest (19.97 kWh). I have only one year of data, so I cannot say if this repeats every year.

**Figure 7 - Scatter plot of usage vs lag_reactive (Objective 4).** *Shows:* each dot is one reading. *Found:* the dots go up from left to right, so more reactive power means more usage (r = 0.90). The red Maximum load dots are on the upper right.
*They may ask:* "What are reactive power and power factor?" - Reactive power is power that flows in the wires but does no useful work (motors and furnaces create it). Power factor tells how well the power is used: near 100 is good, low is poor. In my data the power factor is poor mostly when the plant is nearly idle (average usage only 3.61 kWh).

**Figure 8 - Model comparison (Objective 5).** *Shows:* left, R2 of the 4 models; right, RMSE. *Found:* Random Forest is best in both.

**Figure 9 - Actual vs predicted (Objective 5).** *Shows:* left, real usage against predicted usage; right, the first 200 test readings. *Found:* the dots are almost on the red line, so the predictions are very close to the real values.

**Figure 10 - Feature importance (Objective 5).** *Shows:* which input columns the Random Forest uses most. *Found:* lag_reactive is by far the most important (84.4 percent), then avg_pf (9.5 percent).

---
## The 4 models in simple words
| Model | How it works (simple) | Test R2 | Test RMSE |
|---|---|---|---|
| Multiple Linear Regression | Finds the best straight line through the data using all inputs: y = b0 + b1x1 + b2x2 + ... | 0.9112 | 10.045 |
| Polynomial Regression (degree 2) | Same, but also uses squares and products of inputs so it can follow curves | 0.9819 | 4.538 |
| Decision Tree | Asks yes/no questions on the inputs and gives the average usage of the group at the end | 0.9954 | 2.292 |
| Random Forest | 100 decision trees, each on a random part of the data, and the final answer is their average | 0.9996 | 0.703 |

**Why Random Forest is best:** many trees averaged give a more accurate and stable answer than one tree, and trees can follow relationships that are not straight lines.

## Measures
* **MAE** = average of the absolute errors (kWh). Lower is better.
* **MSE** = average of the squared errors. **RMSE** = square root of MSE, in kWh. Lower is better.
* **R2** = how much of the changes in usage the model explains. 1 is perfect.
* **Train R2 vs Test R2:** if train is very high and test is much lower, the model is overfitting (learned the training data by heart). Here both are almost the same, so there is no serious overfitting.

## Questions you may get
| Question | Answer |
|---|---|
| Why is R2 so high? | In electrical theory reactive power and power factor are directly connected to the real power, so the model can almost calculate usage from them. It is an estimator, not a forecast of the future. |
| What is train test split? | 80 percent of rows to learn from, 20 percent kept hidden to test. random_state = 42 keeps the split the same every time. |
| Why scaling for linear and polynomial models? | They are affected by the size of the numbers, so StandardScaler puts all columns on the same scale. Trees do not need it. |
| What was the wrong data problem? | The 12 AM reading (nsm = 0) had the same day instead of the next day, 365 times. I moved them to the next day and sorted the data. |
| Missing values and duplicates? | None found (checked with isna() and duplicated()). |
| What did you do in feature engineering? | Made hour, month, day number, is_weekend, shift, total_reactive and avg_pf from the date and the readings. |
| What is the IQR rule? | A value is an outlier if it is below Q1 - 1.5 x IQR or above Q3 + 1.5 x IQR, where IQR = Q3 - Q1. |
| What does p-value mean? | The chance of seeing such a difference if there were really no difference. Below 0.05 means the difference is real. |
| What does the website do? | Flask (app.py) loads the saved Random Forest and sends data to the page through routes like /api/predict. The page (HTML, CSS, JavaScript) shows graphs and the predictor. |
| What would you improve? | Use past usage values to forecast, add weather and production data, and also classify the load type. |
