---
layout: post
title: "Kaggle: Home Credit Default Risk"
categories: ml
author: chaoalexander
comment: True
---

I choose this [competition](https://www.kaggle.com/competitions/home-credit-default-risk/overview) beacuse I have done similar models in my previous work and have some experience in loan applications. Additionally, there are  many good historical works to refer to. Finally, loan application is a good scenario for machine learning which is quite common in daily life.

I spent about a month to finish this project, I got 0.79617 public score and 0.79178 private score. According to the [official ranking](https://www.kaggle.com/competitions/home-credit-default-risk/code?competitionId=9120&sortBy=scoreDescending), it seems to be a good result.The most important thing is that I learned a lot during this process. You can refer to or use my code [here](https://github.com/chaoalexander/home_credit/blob/main/home_credit.ipynb) without any limits, You can understand the code based on the following content.

![kaggle score]( {{ site.url }}/assets/images/scores.png )


Reference notebooks:

+ [Start Here:A Gentle Instroduction](https://www.kaggle.com/code/willkoehrsen/start-here-a-gentle-introduction/notebook)
+ [LightGBM with Simple Features](https://www.kaggle.com/code/jsaguiar/lightgbm-with-simple-features?scriptVersionId=6025993)
+ [Baseline for credit risk](https://www.kaggle.com/code/omarhussien12/baseline-for-credit-risk)
+ [load data (reduce memory usage)](https://www.kaggle.com/code/gemartin/load-data-reduce-memory-usage)
+ [Understand Variables in Chinese](https://www.kaggle.com/code/fanzzz/understand-variables-in-chinese)

Reference documents:

+ [OReilly.Hands-On Machine Learning with Scikit-Learn Keras and TensorFlow 3rd Edition 2022.10](https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/)
+ [scikit-learn doc](https://scikit-learn.org/stable/user_guide.html)
+ [Histogram-Based Gradient Boosting Ensembles in Python](https://machinelearningmastery.com/histogram-based-gradient-boosting-ensembles/)
+ [LightGBM doc](https://lightgbm.readthedocs.io/en/v3.3.2/)
+ [深入理解LightGBM](https://zhuanlan.zhihu.com/p/99069186)
+ [LightGBM调参方法](https://www.cnblogs.com/bjwu/p/9307344.html)


## Competition Description

The goal of this competition is to predict the repayment ability of users with given information in probabilistic manner.It use supervised learning, regression problem, '0' in the label data indicates good people,'1' indicates bad people, and the value given by the algorithm is between '0' and '1',After cleaning the features, test on multi models.The competition organizer requires AUC as metrics.Based on my experience,auc=0.75 is the minimum preformance standard.

The competition provides 9 tables, 2.5G size after decompression, which are:

1. application_train.csv: 307511 rows, demographic information for applicant with labels.
2. application_test.csv:50000+ rows, demographic information for applicant without labels.
3. bureau.csv:data returned by the credit center, each representing a loan from the applicant, including all applicants, needs to be aggregated at the granularity of the applicant.
4. bureau_balance.csv:data returned by the credit center,each represents the overdue of one of the latest 24 installments of a loan in bureau.csv, which need to be aggregated with sk_bureau_id as primary key.
5. previous_application.csv: Home credit's own data, each representing a previous loan
6. POS_CASH_balance.csv：Details of loans with type pos in the previous_application.csv
7. installments_payments.csv:Details of loans with type installment in the previous_application.csv
8. credit_card_balance.csv:Details of loans with type credit card in the previous_application.csv
9. HomeCredit_columns_description.csv:The explanatory information for each field in each table, which may not be very clear

More information at [here](https://www.kaggle.com/competitions/home-credit-default-risk/data),If you are a native Chinese speaker, you can refer to [this](https://www.kaggle.com/code/fanzzz/understand-variables-in-chinese).


### Observations:

+ The most difficult part of this competition is understanding the data. Although there are many fields in the 9 tables provided, the explanations are very simple and many of the field values are unclear. It is difficult to create new features based on this foundation, and it requires some time and financial business knowledge to understand the data.
+ This competition is relatively friendly to beginners, and there are many good notebooks to refer to, meanwhile if you have some new ideas want to test, you can use these data.
+ Overall, the given data can be divided into 4 parts: time, amount, number, and other.
+ There may be some variables with high predictive power, such as "EXT_SOURCE_2", which may be external data purchased, such as FICO scores, and the "FLAG_DOCUMENT_3" variable may be proof of income or something similar.
+ The "Bureau" data is similar to parsing a credit report, where if a person applies for multiple loans, such as mortgage, car loan, or business loans, there will be multiple data rows for that person in this table. The "Bureau_balance" is similar to the additional tagged data for each loan in Bureau. If a person has no data in the "Bureau" table, it may mean that the person has never borrowed money or that the borrowing channel has not reported data.
+ Some ratio features are also very useful, such as the actual interest rate information for previous loans in the "previous_application" table, the number of repayments, and the ratio of work years to age. Because financial credit review is more concerned about the interpretability of the model, at the end of the work, I explained multiple variables that were considered important by different models.
+ The largest amount of work is to process variables for each table, aggregating multiple data rows into meaningful single entries at the applicant level, which requires a lot of data exploration. If possible, the data can be imported into a database for processing and calculation.
+ It was discovered that some time related samples have the value of 365243.0, which is clearly abnormal, according to the [official explanation](https://www.kaggle.com/c/home-credit-default-risk/discussion/57248).
+ Light GBM is a powerful and efficient model that can easily increase the auc value of the model by approximately 0.02.


## preparation

In this step, I import some neccessary packages or classes and config the display of jupyter-notebook, I also have placed the common functions needed for some different modules here, which include:
```python
def reduce_mem_usage(df, ignore_cols=['SK_ID_CURR','SK_ID_BUREAU','SK_ID_PREV']):
    """
    Reduce memory usage of dataframe by converting digital data types without 
    losing data information
    ----------
    Args:
    - df (pandas.DataFrame): The input data frame to be optimized.
    - ignore_cols (list, optional): A list of column names to be ignored during 
      memory optimization. Default value is ['SK_ID_CURR', 'SK_ID_BUREAU', 'SK_ID_PREV'].

    Returns: 
    ----------
    pandas.DataFrame: The optimized dataframe.
    """
```

```python
def select_low_cardinality_numeric_features(df, label_col, threshold=5):
    """
    Selects numerical features except for the label_col and checks if the number of 
    unique values is less than the threshold.If yes, the name of the feature will be 
    added to the list low_cardinality_feats and returned.

    Args:
    ----------
    - df(pandas.DataFrame):The dataset containing features and target variable.
    - label_col(str):The name of the label
    - threshold(int):The threshold of the number of unique values. Features with unique 
      values less than this threshold will be considered as "low cardinality features". 
      The default value is 5.

    Returns:
    ----------
    low_cardinality_feats(list):The list of names of numerical features with low cardinality.
    """
```

```python
def cross_validate_with_feature_importance(models, data, labels, n_folds=5):
    """
    Performs cross-validation for each model and outputs the ROC AUC score for each fold.
    If the model supports feature importance evaluation, it outputs the relative importance 
    ranking for each feature.

    Args:
    ----------
    - models: a list of models to evaluate
    - data: the input data for the models
    - labels: the target labels for the input data
    - n_folds: the number of folds to use in cross-validation

    Returns: 
    ----------
    - trained_models(list):a list of trained models
    """  
```

```python
def load_data(data_set_name:str):
```

```python
def trans_inf_days(df):
    """
    Identifies samples with a time value of 365243.0, which is obviously anomalous, 
    and replaces them with NaN.
    Based on the official explanation(https://www.kaggle.com/c/home-credit-default-risk/discussion/57248).

    Args:
    ----------
    - df(pandas.DataFrame):Data frame containing the time feature to be transformed

    Returns:
    ----------
    - df(pandas.DataFrame):Data frame with transformed time feature
    """
```

```python
def missing_values_summary(df):
    """
    A function that calculates the summary of missing values for each column in a 
    pandas DataFrame.

    Args:
    ----------
    df (pandas.DataFrame): The input DataFrame
    Returns:
    ----------
    mis_val_table_ren_columns (pandas.DataFrame): A DataFrame that displays the number and 
    percentage of missing values for each column that has missing values, sorted in descending 
    order by percentage. Also displays the data type of each column.
    """
```

```python
def transform_features(data, num_pipeline, cat_number_pipeline, cat_object_pipeline):
    """
    This function selects numeric and object columns from input dataframe,
    applies specified pipeline strategies to each column type, and returns the transformed dataframe.

    Args:
    ----------
    - data (pandas.DataFrame): Input dataframe
    - num_pipeline (sklearn.pipeline.Pipeline): Pipeline strategy for numeric columns
    - cat_object_pipeline (sklearn.pipeline.Pipeline): Pipeline strategy for object columns
    - cat_number_pipeline (sklearn.pipeline.Pipeline): Pipeline strategy for low-cardinality numeric columns

    Returns:
    ----------
    - transformed_data (pandas.DataFrame): Transformed dataframe
    """
```

## load data
In this step, I have used the kaggle command to obtain data and decompress it to the data folder, then I load the train set data into memory.

Since I trained the model on my personal computer and was limited by memory, whenever I finished processing the data in the table, I deleted it to ensure that there was as little data as possible in the memory. Although this may take some time, it ensures that my memory is sufficient for calculations. And I also use the function named 'reduce_mem_usage' to compress data without losing information. It can compress data to approximately 20% -80% of its original size. This idea is based on [this](https://www.kaggle.com/code/gemartin/load-data-reduce-memory-usage). This method can cause some problems. For example, when calculating the mean, you may find that you get infinity because the data type has been changed, causing the sum step in the calculation of the mean to exceed the limit of the number of digits. Therefore, if you have enough memory, you may not need to compress the data.

## split data
Because the application_test dataset in this competition does not have a target variable, the AUC cannot be calculated, so it is discarded and the application_train dataset is split into a training set and a test set. Of course, you can also choose not to split the dataset and use cross-validation scores as a measure of model performance, but in this case, you won't know how well your model performs until you submit it.

There are various strategies for splitting the dataset, such as random splitting or stratified splitting. In this scenario, since the dataset is relatively large and there are more bad samples, random splitting is preferred.

## quick glance
In this step, I only see the data types and missing values, you can do more data exploration works, such as checking the distribution of each variable and observing the relationship(linear or nonlinear) between individual variables and labels, or using beautiful charts to reflect this relationship. You can use functions like the following to view the distribution of individual variables.
```python
def show_continuous_hist(df, scale, min_limit, max_limit, bin_num):
    df_cat = np.ceil(df / scale)
    df_cat.where(df_cat < max_limit, max_limit,inplace=True)
    df_cat.where(df_cat > min_limit, min_limit,inplace=True)
    df_cat.hist(bins = bin_num )
```

## config cell code to execute
Although we can wrap a piece of code in a function and control whether it is executed through function calls, sometimes we need strong interactivity for debugging code, and we want the output of the code to be printed at the location of the code itself rather than the location of the function call. Therefore, we can control whether a piece of code is executed by setting switches and centralizing the maintenance of these switches.

## baseline
In the baseline module, I only used demographic data from the `application_train` table and filled in missing values. For continuous numeric variables, I used the median to fill in missing values and performed normalization. For categorical variables, I used a special marker "UNK" to represent unknown values and performed one-hot encoding. The reason for doing this was to introduce as little error as possible.

Then I used several simple models without any hyperparameter tuning and performed cross-validation. The `LinearRegression` and `MLPRegressor` performed the best, with an AUC score of 0.7461 ± 0.0038 and 0.7109 ± 0.0121, respectively. This performance is pretty good.

## add more information
I spent a lot of time on this module, trying to understand each field in every table and see if it can be processed into new variables. I also observed the missing and outlier values for each field and aggregated the available fields into new variables based on the granularity of the applicant. Despite these efforts, I still feel that there is a lot of space for improvement in this area, and there are many variables that could be added, some of which may have high predictive power but were overlooked due to my misunderstanding. In addition, we can also aggregate each field by applicant to calculate mean, maximum, minimum, unique values, etc. This can also generate many features.

Finally, I concatenated all the new features together. Originally we had 122 features, and now we have 407. I applied the same preprocessing steps to these new features and trained a rough model using them. The LinearRegression and MLPRegressor models achieved AUC scores of 0.7656 ± 0.0022 and 0.7594 ± 0.0043, respectively. These scores represent an improvement of about 0.02 and 0.05, respectively, and the standard deviation has also decreased.

## feature transform and add ploy feature
According to my past experience, dividing two variables can yield a good new variable, such as credit card utilization rate. This type of variable has strong interpretability, so I only performed division operations on the variables. If we have more time, we can multiply two variables, or compute Nth powers, or calculate logarithms, and so on.

We have a total of 407 features, and if we divide them pairwise, there will be $C_{407}^{2} / 2$ new features, which will cause the [curse of dimensionality](https://en.wikipedia.org/wiki/Curse_of_dimensionality). Therefore, I divided the features into four categories: time, amount, number, and other, and then divided the features within each category pairwise. Then, I used the `evaluate_features` function to select the most important N features as new features. This function selects features using the feature importance attribute of decision tree, and retains the top N most important features after each training. Then, the 100 newly added features are combined for the next round of training, until all possible feature combinations have been traversed.

Even if the features are grouped by type, there is still a lot of computational overhead in feature combination. For example, there are 107 time-type features, and there are about 5600 feature combinations according to $C_{107}^{2} / 2$ , which requires 56 rounds of decision tree training. Therefore, you can directly use the features that I have selected.

There is a lot of improvement in this module. Grouping features by type may result in the loss of some important information. For example, the per capita household income is obtained by dividing the total income by the total population of the household, where the total income is in the amount category, and the total population is in the other category, so this feature cannot be generated. If you have sufficient computing power or time, you can calculate more ratio features or improve this algorithm to select better features.

I added a total of 35 ratio features, and now we have 442 new features. We processed these variables in the same way as before, and then ran a rough model using these new variables. The LinearRegression and MLPRegressor obtained AUC scores of 0.7675 ± 0.0028 and 0.7540 ± 0.0081, respectively. The improvement and decline are negligible, which does not mean that this step has no effect. It may be because our model is not powerful enough to learn from the new features, I will validate this later.

## delete invaild feature
Feature selection is considered an effective method to improve the generalization performance of a model and reduce the risk of overfitting. In practical production environments, feature selection techniques can effectively compress the model to speed up its execution and reduce the model's usage conditions. In this module, I used ExtraTreesRegressor as the base estimator and the SelectFromModel algorithm in sklearn to select features. We can use the parameter `threshold` to control the number of retained features, for more details, please refer [here](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.SelectFromModel.html).

After one hot processing, there are 881 remaining features, and after selecting with default parameters, there are 334 remaining features, compressing nearly 60%. I performed the same processing on the selected features as before, and then ran a rough model using these new features. The LinearRegression and MLPRegressor respectively obtained auc scores of 0.7672 ± 0.0038 and 0.7191 ± 0.0102. The performance of the LR model did not decrease significantly, while the performance of the NN model decreased greatly. This may be because our model is too rough and the NN model is underfitting. Since feature selection requires a lot of time to filter out truly ineffective features, I ignored this part of the work.

## try more model and fine tune
I divide the models into two categories: one is sensitive to missing values, as most models are, and the other is insensitive to missing values. The latter is based on the HistGradientBoostingRegressor algorithm, which bins continuous numerical variables and puts missing values into a separate bin. This greatly improves the efficiency of tree models' node splitting. For more information, please refer to [this article](https://machinelearningmastery.com/histogram-based-gradient-boosting-ensembles/).

There are mainly three types of models that are sensitive to missing values: linear models, tree model, and ensemble models.

For linear models, I have tested almost every linear model and fine-tuned their parameters. Their advantages include fast training speed and the normalization of all variables in the training set. Therefore, the feature coefficients of linear models can be used as a ranking of feature importance. Specifically, the Lars and OrthogonalMatchingPursuit models can discard nonlinear variables and set their coefficients to zero, which are considered unimportant variables. The best models in this category achieved an AUC score of almost 0.77 in cross-validation.

For tree model, I only fine-tuned the basic models to enhance their learning ability, increasing their AUC score from 0.5 to 0.71. However, they are still relatively weak learners.

For ensemble learning, I tried bagging, voting, stacking, random forests, ExtraTrees, gradient boosting trees, and other methods, and performed simple parameter tuning. However, I eventually abandoned them due to the long training time of individual model.

For models that are not sensitive to missing values, I tested HistGradientBoostingRegressor and LGBMClassifier and performed a lot of tuning work, including using grid search. Since this technique is very resource and time-consuming, I mostly tuned the parameters manually. In the end, I achieved an AUC score of almost 0.79 in cross-validation using LGBMClassifier.

## The end
At this point, most of the modeling work has been completed. I used the tuned parameters and models to train on the training set and validated on the split test set, achieving a score of 0.7938. Then, I trained the final version of the model on the entire dataset and made predictions on the application_test data, and submitted the results. The competition is now over, and in the next blog post, I will analyze some of the variables that showed strong predictive power in this competition.











