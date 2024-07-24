# The Happiness Chronicles: Exploring the Key Drivers of Global Well-Being

## Overview

This project presents an interactive narrative visualization based on the World Happiness Report dataset for the years 2016 to 2019. Developed using D3.js, this visualization provides insights into global happiness scores, trends over time, and factors contributing to happiness across various countries.

## Scenes Description

### Scene One: Global Happiness Overview (2019)

**Description**: This scene features a choropleth map displaying the happiness scores of countries for the year 2019. The map uses a color gradient with varying shades of red, where darker shades represent higher happiness scores.

**Key Features**:
- **Hover Interaction**: Hovering over a country displays a tooltip with the country name and its happiness score.
- **Dropdown Menu**: A dropdown menu allows users to select a specific country. When selected, the chosen country is highlighted on the map while others are grayed out.

**Purpose**: This scene provides a visual overview of global happiness distribution through the years 2016 to 2019, allowing users to quickly identify which countries have higher or lower happiness score for the selected year.

**Annotations**:
- Tooltips show the country name and happiness score on hover.
- Labels highlight regions with high and low happiness scores on the color scale legend.

**Parameters**:
- `selectedCountry`: The country selected from the dropdown menu to highlight on the map.
- `happinessScore`: The happiness score used to determine the color of each country on the map.
- `year`: The year of the data being displayed (2019 in this case).

**Triggers**:
- **Dropdown Selection**: Changes the `selectedCountry` parameter, updating the map to highlight the selected country.

### Scene Two: Happiness Score Trends (2016-2019)

**Description**: This scene includes a bar chart that compares the happiness scores of countries across the years 2016 to 2019.

**Key Features**:
- **Dropdown Menu**: Users can select a country from a dropdown list to view its happiness score trends over the selected years.
- **Bar Chart Visualization**: The bar chart displays the annual happiness scores for the chosen country, enabling users to observe changes and trends over time.

**Purpose**: This scene allows users to analyze how happiness scores have evolved for different countries over the years, offering insights into long-term trends and fluctuations.

**Annotations**:
- Tooltips provide detailed information about each bar, including country name, happiness score, and other metrics.
- Titles and labels explain the context of the chart, such as "Happiness Scores in 2019".

**Parameters**:
- `selectedYear`: The year for which happiness scores are being displayed in the bar chart.
- `happinessScores`: The array of happiness scores for the selected year.
- `highlightedCountry`: The country being highlighted when hovering over bars.

**Triggers**:
- **Hovering Over Bars**: Updates the `highlightedCountry` parameter, showing tooltips with detailed information.
- **Year Selection**: Updates the `selectedYear` parameter, refreshing the chart with data for the selected year.

### Scene Three: Factors Influencing Happiness

**Description**: This scene presents an interactive bar chart breaking down the factors contributing to the happiness score of a selected country and year. Factors include GDP per capita, social support, healthy life expectancy, freedom to make life choices, generosity, and perceptions of corruption.

**Key Features**:
- **Dropdown Menus**: 
  - **Year Selector**: Allows users to choose a year.
  - **Country Selector**: Allows users to select a country.
  - **Factor Selector**: Allows users to select the factors they want to compare.
- **Bar Chart Visualization**: The bar chart displays the values of various factors contributing to happiness for the selected country and year. The chart also includes a title above the visualization that shows the happiness score for the chosen country and year.

**Purpose**: This scene provides an in-depth view of how different factors influence happiness scores, enabling users to explore the relative importance of each factor for a given country and year.

**Annotations**:
- Tooltips show the values of each factor when hovering over the bars.
- Labels and titles provide context, such as the selected year and country.

**Parameters**:
- `comparisonMetric`: The metric being compared across countries (e.g., GDP per capita, social support).
- `happinessScores`: The happiness scores used in the comparison.
- `highlightedCountry`: The country being highlighted when hovering over bars or other elements.

**Triggers**:
- **Metric Selection**: Changes the `comparisonMetric` parameter, updating the chart to reflect the new comparison.
- **Hovering Over Elements**: Updates the `highlightedCountry` parameter, showing tooltips with detailed information.

## How to Use

1. **Scene One**: Explore the global distribution of happiness scores by interacting with the map and using the dropdown menu to highlight specific countries.
2. **Scene Two**: Analyze happiness score trends over the years by selecting a country from the dropdown menu and observing the bar chart.
3. **Scene Three**: Investigate the factors contributing to happiness by selecting a country and year from the dropdown menus. The bar chart will update to show the values of different factors and the happiness score.

## Running the Project

To run this project, you can use a local server. Here are two options:

### 1. Using Python HTTP Server

1. Open a terminal and navigate to the directory containing your project files.
2. Run the following command to start a local server:

   ```bash
   python -m http.server

3. Open a web browser and go to http://localhost:8000 to view the project.

### 2. Using Live Server Extension

1. If you are using Visual Studio Code, install the "Live Server" extension.
2. Open your project folder in Visual Studio Code.
3. Right-click on the html scene files and select "Open with Live Server" to start the server and view the project.
