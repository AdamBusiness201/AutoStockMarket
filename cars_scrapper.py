import requests
from bs4 import BeautifulSoup
import re
import pandas as pd
import json

# Function to fetch and parse the page
def fetch_and_parse(url):
    response = requests.get(url)
    response.raise_for_status()  # Check for request errors
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup

# Function to find all links on the page
def find_all_links(soup):
    links = []
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        if href.startswith('/en/catalog/'):
            links.append(href)
    return links

# Function to extract year from URL
def extract_year_from_url(url):
    match = re.search(r'/en/catalog/[^,]+,(\d{4})', url)
    if match:
        return match.group(1)
    return None

# Function to extract model names from a URL
def extract_model_names_from_url(url):
    soup = fetch_and_parse(url)
    model_names = set()
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        if href.startswith('/en/catalog/'):
            # Extract the model name from the URL
            model_match = re.search(r'/en/catalog/[^,]+,\d{4},([^,]+)', href)
            if model_match:
                model_name = model_match.group(1)
                model_names.add(model_name)
                print(f"Found model name: {model_name} in URL: {href}")
    return model_names

# Load the categories from the CSV file
categories_df = pd.read_csv('rockauto_categories.csv')
categories = list(categories_df[['Category', 'URL']].itertuples(index=False, name=None))

# Initialize a list to store results
results = []

# Process each category
for name, path in categories:
    print(f"Processing category: {name}")
    url = f"https://www.rockauto.com{path}"
    
    # Fetch and parse the page
    soup = fetch_and_parse(url)
    
    # Find all links on the page
    all_links = find_all_links(soup)
    
    # Extract years from links
    years = set()
    for link in all_links:
        year = extract_year_from_url(link)
        if year:
            years.add(year)
    
    # Process each year to extract model names
    for year in years:
        year_url = f"https://www.rockauto.com{path},{year}"
        print(f"Processing year URL: {year_url}")
        
        # Fetch and print all links for the year
        year_links = find_all_links(fetch_and_parse(year_url))
        for link in year_links:
            model_names = extract_model_names_from_url(f"https://www.rockauto.com{link}")
            for model_name in model_names:
                results.append({
                    'Category': name,
                    'Year': year,
                    'Model Name': model_name
                })

# Convert results to a DataFrame
results_df = pd.DataFrame(results)

# Save to Excel
results_df.to_excel('rockauto_model_data.xlsx', index=False)

# Save to JSON
with open('rockauto_model_data.json', 'w') as json_file:
    json.dump(results, json_file, indent=4)

print("Model data saved to 'rockauto_model_data.xlsx' and 'rockauto_model_data.json'")