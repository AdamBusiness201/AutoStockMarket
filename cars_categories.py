import requests
from bs4 import BeautifulSoup
import pandas as pd

# Define the URL
base_url = "https://www.rockauto.com/en/catalog/"

# Send a request to fetch the HTML content
response = requests.get(base_url)
soup = BeautifulSoup(response.text, 'html.parser')

# Initialize an empty list to store category data
categories = []

# Loop through possible category XPaths.
for i in range(2, 305):  # Assuming 304 categories based on your input

    xpath = f'//*[@id="navhref[{i}]"]'

    # Find the category link using CSS selector for IDs

    category_element = soup.select_one(f'#navhref\\[{i}\\]')

    if category_element:
        name = category_element.get_text(strip=True)
        link = category_element.get('href')
        categories.append((name, link))

# Save the data to a CSV file

df = pd.DataFrame(categories, columns=['Category', 'URL'])

df.to_csv('rockauto_categories.csv', index=False)

print("Categories saved to 'rockauto_categories.csv'")
import requests
from bs4 import BeautifulSoup
import re
import pandas as pd

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

# Initialize an empty dictionary and list to store results
category_years = {}
df_list = []

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

    # Store the results in the dictionary
    category_years[name] = sorted(years)

    # Add to list for DataFrame
    for year in sorted(years):
        df_list.append({'Category': name, 'Year': year})

# Convert the list to a DataFrame
df = pd.DataFrame(df_list)

# Print the dictionary with categories and their corresponding years
print(category_years)

# Print the DataFrame
print(df)

# If needed, save the DataFrame to an Excel file
df.to_excel('rockauto_categories_and_years.xlsx', index=False)