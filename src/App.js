// @flow
import React, { PureComponent } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Icon, Thumbnail } from 'native-base';
import Calculator from './pages/Calculator';
import Counter from './pages/Counter';

type ChoosenPage = 'counter' | 'calculator';
const PAGES = {
  counter :    Counter,
  calculator : Calculator
};

export default class App extends PureComponent {
  state: {
    activeTab: ChoosenPage
  };
  state      = {
    activeTab : 'counter'
  };
  choosePage = (page: ChoosenPage) => () => this.setState({
    activeTab : page
  });

  render() {
    const { activeTab }  = this.state;
    const PageComponent  = PAGES[activeTab];

    return (
      <Container>
        <Header>
          <Title>Ко-Ко-Kounter</Title>
        </Header>

        <Content>
          <View style={style.logo}>
            <Thumbnail source={require('./assets/petuh.png')}
                       size={100}
            />
          </View>
          <PageComponent/>
        </Content>
        <Footer >
          <FooterTab>
            <Button onPress={this.choosePage('counter')}
                    active={activeTab === 'counter'}
            >
              Protein Counter
              <Icon name='ios-pizza-outline'/>
            </Button>
            <Button onPress={this.choosePage('calculator')}
                    active={activeTab === 'calculator'}
            >
              Protein price
              <Icon name='ios-calculator-outline'/>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}
const style = StyleSheet.create({
  logo : {
    flexDirection: 'row',
    justifyContent : 'center'
  }
});