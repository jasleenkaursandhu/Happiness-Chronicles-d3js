import pandas as pd

# Load the datasets
df_2018 = pd.read_csv('2018_mapped.csv')
df_2019 = pd.read_csv('2019_mapped.csv')

# Merge datasets on 'Country or region'
merged_df = pd.merge(df_2018, df_2019, on='Country or region', suffixes=('_2018', '_2019'))

# Check merged dataset
print(merged_df.head())

# Calculate difference in happiness scores
merged_df['Score_Difference'] = merged_df['Score_2019'] - merged_df['Score_2018']

