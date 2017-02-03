// @flow
import React, { PureComponent } from 'react';
import { View, Text, AsyncStorage, StyleSheet } from 'react-native';
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

    console.log('restoring state', counted);
    this.setState({
      counted : parseInt(counted) || 0
    });
  }

  componentWillMount() {
    this.loadCounted();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.counted !== nextState.counted) {
      console.log('saving state', nextState.counted);
      AsyncStorage.setItem(ALREADY_COUNTED, `` + nextState.counted)
      .then(() => console.log('saved', nextState.counted))
      .catch(console.log.bind(console));
    }
  }

  handleAddPress         = () => {
    const proteine = parseInt(this.state.proteine);
    if (isNaN(proteine)) {
      return;
    }
    this.setState({
      counted : this.state.counted + proteine
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
  handleClearPress       = () => this.setState({
    counted : 0
  });
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
  calculate              = () => {
    console.log(this.state);
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

        <Button
          onPress={this.handleAddPress}
          style={[style.margins, style.center]}
        >
          Добавить
        </Button>
        <Button
          onPress={this.handleReducePress}
          style={style.center}
        >
          Убавить
        </Button>
        <Button
          onPress={this.handleClearPress}
          style={style.center}
          danger
        >
          Сбросить
        </Button>
      </View>
    )
  }
}

const style = StyleSheet.create({
  margins : {
    marginTop :    20,
    marginBottom : 20
  },
  center :  {
    alignSelf : 'center'
  }
});