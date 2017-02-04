// @flow
import React, { PureComponent } from 'react';
import { View, Text, AsyncStorage, StyleSheet, Alert } from 'react-native';
import { H1, List, ListItem, InputGroup, Input, Button } from 'native-base';
import memoize from 'lodash/memoize';

const ALREADY_COUNTED = 'ALREADY_COUNTED';

export default class extends PureComponent {
  state: {
    counted: number,
    proteine: string,
    weight: string,
    percentage: string
  };

  state = {
    counted :    0,
    proteine :   '',
    weight :     '',
    percentage : ''
  };

  async loadCounted() {
    const counted = await AsyncStorage.getItem(ALREADY_COUNTED);

    this.setState({
      counted : parseInt(counted) || 0
    });
  }

  componentWillMount() {
    this.loadCounted();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.counted !== nextState.counted) {
      AsyncStorage.setItem(ALREADY_COUNTED, `` + nextState.counted);
    }
  }

  handleAddPress         = () => {
    const proteine = parseInt(this.state.proteine);
    if (isNaN(proteine)) {
      return;
    }
    this.setState({
      counted :    this.state.counted + proteine,
      proteine :   '',
      weight :     '',
      percentage : ''
    });
  };
  handleReducePress      = () => {
    const proteine = parseInt(this.state.proteine);
    if (isNaN(proteine)) {
      return;
    }
    this.setState({
      counted : this.state.counted - proteine
    });
  };
  handleClearPress       = () => {
    Alert.alert(
      'Уверены что хотите очистить счетчик?',
      '',
      [
        {
          text :    'Да',
          onPress : () => this.setState({
            counted :    0,
            proteine :   '',
            weight :     '',
            percentage : ''
          })
        },
        {
          text :  'Нет',
          style : 'cancel'
        },
      ],
      { cancelable : true }
    );

  };
  handleProteineChange   = proteine => this.setState({
    proteine,
    weight :     '',
    percentage : ''
  });
  handleCalcFieldsChange = memoize(field => value => {
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) {
      return this.setState({
        [field] : value
      })
    }
    this.setState({
      [field] : value
    }, this.calculate)
  });
  handleTemplatePress    = memoize(proteine => () => this.setState({
    proteine,
    weight :     '',
    percentage : ''
  }));
  calculate              = () => {
    this.setState({
      proteine : '' + this.state.percentage * this.state.weight / 100
    });
  };

  render() {
    return (
      <View>
        <H1>Насчитано {this.state.counted} грамм</H1>
        <List>
          <ListItem>
            <InputGroup>
              <Input
                label="Грамм на сотню"
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
                label="Грамм продукта"
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
                label="Грамм протеина"
                keyboardType="numeric"
                value={this.state.proteine}
                onChangeText={this.handleProteineChange}
                inlineLabel
                on
              />
            </InputGroup>
          </ListItem>
        </List>
        <View style={style.line}>
          <Button
            onPress={this.handleTemplatePress('25')}
          >
            Коктейль
          </Button>
        </View>
        <View style={style.line}>
          <Button
            onPress={this.handleAddPress}
            success
          >
            Добавить
          </Button>
          <Button
            onPress={this.handleReducePress}
            warning
          >
            Убавить
          </Button>
        </View>
        <View style={style.line}>
          <Button
            onPress={this.handleClearPress}
            danger
          >
            Сбросить
          </Button>
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  line : {
    flexDirection :  'row',
    alignItems :     'center',
    justifyContent : 'space-around'
  }
});