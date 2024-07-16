import pandas as pd

# Define the mapping dictionary
country_name_mapping = {
    "United States": "USA",
    "United Kingdom": "England",
    "Korea": "South Korea",
    "Trinidad & Tobago": "Trinidad and Tobago",
    "North Macedonia": "Macedonia",
    "Czech Republic": "Czechia",
    "Palestinian Territories": "Palestine",
    "Congo (Kinshasa)": "Democratic Republic of the Congo",
    "Congo (Brazzaville)": "Republic of the Congo",
    "Tanzania": "United Republic of Tanzania"
}

# Read the CSV file
df = pd.read_csv('2018.csv')

# Apply the mapping to the 'Country or region' column
df['Country or region'] = df['Country or region'].replace(country_name_mapping)

# Save the modified DataFrame back to a CSV file
df.to_csv('2018_mapped.csv', index=False)

print("Country names have been successfully mapped and saved to '2019_mapped.csv'.")
