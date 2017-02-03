// @flow
import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { H1, List, ListItem, InputGroup, Input } from 'native-base';
import memoize from 'lodash/memoize';

export default class extends PureComponent {
  state                  = {
    grammPrice : 0,
    weight :     '',
    percentage : '',
    price :      ''
  };
  handleCalcFieldsChange = memoize(field => value => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return this.setState({
        [field] : value
      })
    }
    this.setState({
      [field] : value
    }, this.calculate)
  });

  getPricePerGramm() {
    const { weight, percentage, price } = this.state;
    return price / ((weight < 10 ? weight * 1000 : weight) * percentage / 100);
  }

  calculate = () => {
    const price = this.getPricePerGramm();
    if (price && typeof price === 'number')
      this.setState({
        grammPrice : price.toFixed(2)
      });
  };

  render() {
    return (<View>
        <H1>Грамм белка стоит {this.state.grammPrice} рублей</H1>
        <List>
          <ListItem>
            <InputGroup>
              <Input
                label="Масса продукта (г/кг)"
                keyboardType="numeric"
                value={this.state.weight}
                onChangeText={this.handleCalcFieldsChange('weight')}
                inlineLabel
              />
            </InputGroup>
          </ListItem>

          <ListItem>
            <InputGroup>
              <Input
                label="Белка на сотню"
                keyboardType="numeric"
                value={this.state.percentage}
                onChangeText={this.handleCalcFieldsChange('percentage')}
                inlineLabel
              />
            </InputGroup>
          </ListItem>

          <ListItem>
            <InputGroup>
              <Input
                label="Стоймость"
                keyboardType="numeric"
                value={this.state.price}
                onChangeText={this.handleCalcFieldsChange('price')}
                inlineLabel
                on
              />
            </InputGroup>
          </ListItem>
        </List>
      </View>
    )
  }
}