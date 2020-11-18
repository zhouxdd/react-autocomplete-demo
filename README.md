# instructions

  1. Install elasticsearch locally
    https://www.elastic.co/guide/en/elasticsearch/reference/current/brew.html

  2. Install Japanese analyzer
    `elasticsearch-plugin install analysis-kuromoji`
    https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-kuromoji.html

  3. Create two nodes
    ```
    elasticsearch -Ecluster.name=cluster_dev -Epath.data=cluster_node01 -Enode.name=node01 -Ehttp.port=9200 -d
    elasticsearch -Ecluster.name=cluster_dev -Epath.data=cluster_node02 -Enode.name=node02 -Ehttp.port=9201 -d
    ```
  4. Launch elasticsearch
    `elasticsearch`

  5. create mapping and schema
    ```
    curl -X PUT "localhost:9200/test?pretty" -H 'Content-Type: application/json' -d'
    {
      "settings": {
        "number_of_shards": 2,
        "number_of_replicas" : 1
      },
      "mappings": {
        "properties": {
          "item_name": {
            "type": "text",
            "analyzer": "standard"
          },
          "item_name_jp": {
            "type": "text",
            "analyzer": "kuromoji"
          },
          "store_name": {
            "type": "text",
            "analyzer": "standard"
          },
          "store_jp": {
            "type": "text",
            "analyzer": "kuromoji"
          },
          "item_price": {
            "type": "text"
          },
          "item_image": {
            "type": "text"
          },
          "store_url": {
            "type": "text"
          },
          "menu_id": {
            "type": "text"
          }
        }
      }
    }'
    ```
6. Ingest data
    ```
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/test/_bulk?pretty&refresh" --data-binary "@partaa"
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/test/_bulk?pretty&refresh" --data-binary "@partab"
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/test/_bulk?pretty&refresh" --data-binary "@partac"
    ```
7. Check index status

   `curl -X GET "localhost:9200/_cat/indices/test?pri&v&h=health,index,pri,rep,docs.count,mt&pretty"`

8. Launch a browser with no cors
   `--user-data-dir` can be any directory
   `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-web-security --user-data-dir="./chrome_dev"`
   
9. install react and launch app
  `yarn`
  `yarn start`
  
10. open your app in the no cor browser
  
11. try more analyzer
    if index already exists remove it: `curl -X DELETE "localhost:9200/test"`
    
    create a new mapping
    ```
      curl -X PUT "localhost:9200/test?pretty" -H 'Content-Type: application/json' -d'
        {
          "settings": {
                "analysis": {
              "filter": {
                "katakana_readingform": {
                  "type": "kuromoji_readingform",
                  "use_romaji": "false"
                },
                "romaji_readingform": {
                  "type": "kuromoji_readingform",
                  "use_romaji": "true"
                }
              },
              "analyzer": {
                "ja_reading_analyzer": {
                  "type": "custom",
                  "filter": [
                    "cjk_width",
                    "lowercase",
                    "kuromoji_stemmer",
                    "ja_stop",
                    "kuromoji_part_of_speech",
                    "kuromoji_baseform",
                    "katakana_readingform"
                  ],
                  "tokenizer": "kuromoji_tokenizer"
                },
                "ja_romaji_analyzer": {
                  "type": "custom",
                  "filter": [
                    "cjk_width",
                    "lowercase",
                    "kuromoji_stemmer",
                    "ja_stop",
                    "kuromoji_part_of_speech",
                    "kuromoji_baseform",
                    "romaji_readingform"
                  ],
                  "tokenizer": "kuromoji_tokenizer"
                }
              }
            },
            "number_of_shards": 2,
            "number_of_replicas": 1
          },
          "mappings": {
            "properties": {
              "item_name": {
                "type": "text",
                "analyzer": "standard"
              },
              "item_name_jp": {
                "type": "text",
                "analyzer": "kuromoji"
              },
              "item_name_reading": {
                "type": "text",
                "analyzer": "ja_reading_analyzer"
              },
              "item_name_romaji": {
                "type": "text",
                "analyzer": "ja_romaji_analyzer"
              },
              "store_name": {
                "type": "text",
                "analyzer": "standard"
              },
              "store_jp": {
                "type": "text",
                "analyzer": "kuromoji"
              },
              "item_price": {
                "type": "text"
              },
              "item_image": {
                "type": "text"
              },
              "store_url": {
                "type": "text"
              },
              "menu_id": {
                "type": "text"
              }
            }
          }
        }'
    ```
    run step 6 again

12. update query plans
   ```
     onSuggestionsFetchRequestedJP = ({ value }) => {
       axios
           .post('http://localhost:9200/test/_search', {
             query: {
               multi_match: {
                 query: value,
                 fields: ['item_name_jp^1.0', 'item_name_reading^1.0', 'item_name_romaji^1.0'],
                 fuzzy_transpositions: false,
                 auto_generate_synonyms_phrase_query: false,
                 type: "phrase_prefix",
                 prefix_length: 0,
                 zero_terms_query: "NONE",
                 operator: "OR",
                 max_expansions: 50,
                 boost: 1
               }
             }
           })
           .then(res => {
             const results = res.data.hits.hits.map(h => h._source)
             this.setState({ suggestionsJP: results })
           })
     }
   ```