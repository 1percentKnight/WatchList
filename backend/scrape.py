import requests
from bs4 import BeautifulSoup
import json
import sys
import os
import re

def scrape_imdb_show(id):
    url = f'https://www.imdb.com/title/{id}'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f'Failed to fetch IMDb page for URL: {url}')
        return

    soup = BeautifulSoup(response.content, 'html.parser')

    # Extract data from <meta> tag
    meta_title_tag = soup.find('meta', property='og:title')
    meta_image_tag = soup.find('meta', property='og:image')
    show_name = None
    release_date = None
    end_date = None
    imdb_rating = None
    genres = []
    languages = []
    total_episodes = 1
    duration = None
    poster_url = None

    if meta_title_tag:
        content = meta_title_tag.get('content')
        if content:
            # Extract show name
            show_name = content.split(' (')[0].strip()

            # Extract release date and end date
            year_part = content.split('(')[1].split(')')[0]
            if '–' in year_part:
                years = year_part.split('–')
                release_date = re.search(r'\d{4}', years[0]).group() if re.search(r'\d{4}', years[0]) else None
                end_date = re.search(r'\d{4}', years[1]).group() if len(years) > 1 and re.search(r'\d{4}', years[1]) else 'Ongoing'
            else:
                release_date = re.search(r'\d{4}', year_part).group()
                end_date = release_date

            # Extract IMDb rating
            rating_match = re.search(r'⭐\s(\d+\.\d+)', content)
            if rating_match:
                imdb_rating = rating_match.group(1)

            # Extract genres
            genre_part = content.split('|')[1]
            genres = [genre.strip() for genre in genre_part.split(',')]

    # Extract languages
    language_tags = soup.find_all('a', href=re.compile(r'/search/title\?title_type=feature&primary_language='))
    languages = [tag.get_text(strip=True) for tag in language_tags]

    # Extract total episodes
    episodes_span = soup.find('span', text='Episodes')
    if episodes_span:
        total_episodes = episodes_span.find_next('span', class_='ipc-title__subtext')
        if total_episodes:
            total_episodes = total_episodes.get_text(strip=True)
    
    # Extract duration length
    duration_tag = soup.find_next('meta', property='og:description')
    if duration_tag:
        duration = duration_tag.get('content', '').strip()

    # Extract poster URL
    if meta_image_tag:
        poster_url = meta_image_tag.get('content')

    result = {
        'show_id': id,
        'show_name': show_name,
        'release_date': release_date,
        'end_date': end_date,
        'imdb_rating': imdb_rating,
        'genres': genres,
        'languages': languages,
        'total_episodes': total_episodes,
        'duration': duration,
        'poster_url': poster_url,
    }

    output_dir = os.path.join(os.path.dirname(__file__), 'output')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    file_path = os.path.join(output_dir, 'show_info.json')
    with open(file_path, 'w') as file_location:
        json.dump(result, file_location, indent=4)

def search_imdb(input):
    url = f'https://www.imdb.com/find/?s=tt&q={input}'
    print("Input id is :" + input)
    print("Search url is: " + url)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f'Failed to fetch IMDb page for URL: {url}')
        return
    soup = BeautifulSoup(response.content, 'html.parser')

    a_tag = soup.find('a', class_='ipc-metadata-list-summary-item__t')
    if a_tag:
        href = a_tag.get('href')
        if href:
            imdb_id = href.split('/title/')[1].split('/')[0]
            return imdb_id

        else:
            print("href attribute not found")
    else:
        print("a tag not found")

#  Main
if __name__ == "__main__":
    input = sys.argv[1]
    print(input)
    if input.startswith("http"):
        print("Input is a URL.")
                
        # Find all matches in the URL
        matches = re.findall(r'tt\d{7,8}', input)
        id = matches[0]

    elif input.startswith("tt") and len(input) == 9:
        print("Input is an IMDb ID.")
        id = input

    else:
        print("Input is a search query.")        
        id = search_imdb(input)

    url = f'https://www.imdb.com/title/{id}'
    print(url)

    scrape_imdb_show(id)
