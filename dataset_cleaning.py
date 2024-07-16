import pandas as pd

# Load the datasets
df_2017 = pd.read_csv('2017_mapped.csv')
df_2018 = pd.read_csv('2018_mapped.csv')

# List of columns in the 2018 dataset
columns_2018 = df_2018.columns.tolist()

# Dictionary to rename columns from 2017 to match 2018
rename_columns = {
    'Country': 'Country or region',
    'Happiness.Rank': 'Overall rank',
    'Happiness.Score': 'Score',
    'Economy..GDP.per.Capita.': 'GDP per capita',
    'Family': 'Social support',
    'Health..Life.Expectancy.': 'Healthy life expectancy',
    'Freedom': 'Freedom to make life choices',
    'Trust..Government.Corruption.': 'Perceptions of corruption',
    'Generosity': 'Generosity'
}

# Rename columns
df_2017.rename(columns=rename_columns, inplace=True)

# Add missing columns with default values
missing_columns = set(columns_2018) - set(df_2017.columns)
for col in missing_columns:
    df_2017[col] = None  # You can change 'None' to a more appropriate default value if needed

# Reorder columns to match 2018 dataset
df_2017 = df_2017[columns_2018]

# Save the modified DataFrame to a new CSV file
df_2017.to_csv('2017_mapped_correct.csv', index=False)
