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
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/test/_bulk?pretty&refresh" --data-binary "@partad"
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/test/_bulk?pretty&refresh" --data-binary "@partae"
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/test/_bulk?pretty&refresh" --data-binary "@partaf"
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/test/_bulk?pretty&refresh" --data-binary "@partag"
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/test/_bulk?pretty&refresh" --data-binary "@partah"
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/test/_bulk?pretty&refresh" --data-binary "@partai"
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/test/_bulk?pretty&refresh" --data-binary "@partaj"
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/test/_bulk?pretty&refresh" --data-binary "@partak"
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/test/_bulk?pretty&refresh" --data-binary "@partal"
    ```

7. Check index status
    curl -X GET "localhost:9200/_cat/indices/test?pri&v&h=health,index,pri,rep,docs.count,mt&pretty"

8. Launch a browser with no cors

9. install react and launch app
  `yarn`
  `yarn start`
  
10. open your app in the no cor browser
  