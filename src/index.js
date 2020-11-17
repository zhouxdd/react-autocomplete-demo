import React from 'react'
import ReactDOM from 'react-dom'
import Autosuggest from 'react-autosuggest'
import axios from 'axios'
import { debounce } from 'throttle-debounce'

import './styles.css'

class AutoComplete extends React.Component {
  state = {
    value: '',
    suggestions: [],
    suggestionsJP: []
  }

  componentWillMount() {
    this.onSuggestionsFetchRequested = debounce(
        100,
        this.onSuggestionsFetchRequested
    )
    this.onSuggestionsFetchRequestedJP = debounce(
        100,
        this.onSuggestionsFetchRequestedJP
    )
  }

  renderSuggestion = suggestion => {
    return (
        <div className="result">
          <div>
            <div className="itemNameDisplace">{suggestion.item_name}</div>
            <div className="itemPriceDisplace">{suggestion.item_price}</div>
          </div>
          <img src={suggestion.item_image} alt="itemImage" width="100" height="100"/>
        </div>
    )
  }

  renderSuggestionJP = suggestionJP => {
    return (
        <div className="result">
          <div>
            <div className="itemNameDisplace">{suggestionJP.item_name}</div>
            <div className="itemPriceDisplace">{suggestionJP.item_price}</div>
          </div>
          <img src={suggestionJP.item_image} alt="itemImage" width="100" height="100"/>
        </div>
    )
  }

  onChange = (event, { newValue }) => {
    this.setState({ value: newValue })
  }

  onSuggestionsFetchRequested = ({ value }) => {
    axios
        .post('http://localhost:9200/test/_search', {
          query: {
            multi_match: {
              query: value,
              fields: ['item_name^1.0'],
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
          this.setState({ suggestions: results })
        })
  }

  onSuggestionsFetchRequestedJP = ({ value }) => {
    axios
        .post('http://localhost:9200/test/_search', {
          query: {
            multi_match: {
              query: value,
              fields: ['item_name_jp^1.0'],
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

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }

  onSuggestionsClearRequestedJP = () => {
    this.setState({ suggestionsJP: [] })
  }

  render() {
    const { value, suggestions, suggestionsJP } = this.state

    const inputProps = {
      placeholder: 'using standard analyzer',
      value,
      onChange: this.onChange
    }

    const inputPropsJP = {
      placeholder: 'using Japanese analyzer',
      value,
      onChange: this.onChange
    }

    return (
        <div className="App">
          <h1>AutoComplete Demo</h1>
          <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={suggestion => suggestion.item_name}
              renderSuggestion={this.renderSuggestion}
              inputProps={inputProps}
          />

          <Autosuggest
              suggestions={suggestionsJP}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequestedJP}
              onSuggestionsClearRequested={this.onSuggestionsClearRequestedJP}
              getSuggestionValue={suggestionJP => suggestionJP.item_name}
              renderSuggestion={this.renderSuggestionJP}
              inputProps={inputPropsJP}
          />
        </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<AutoComplete />, rootElement)
