import React, { PureComponent, Component, useState, useEffect } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, RefreshControl, ScrollView, FlatList, Button, Image, TouchableOpacity, Text, View, SafeAreaView, Alert} from 'react-native';
// import settingMysql from "./settingMysql.js";
import home from "./HomeScreen.js";


const dataEx = [
  {id: 1, name: "Food", amount: 10},
  {id: 2, name: "Traffic", amount: 20},
  {id: 3, name: "Fun", amount: 30},
  {id: 4, name: "Fuels", amount: 40}
]

const dataIn = [
  {id: 1, name: "Food", amount: 90},
  {id: 2, name: "Traffic", amount: 800},
  {id: 3, name: "Fun", amount: 700},
  {id: 4, name: "Fuels", amount: 600}
]

function BillScreen({navigation}){

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const [ExIn, setExIn] = useState([1]); // 1 for expense; 2 for income

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    setCurrentDate( year + '/' + month );
  }, []);

  function list() {
    if(ExIn == 1){ // list for expense
      const renderItem = ({item}) => {
        return (
            <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style = {{fontSize: 30}}> {item.type}</Text>
              <Text style = {{fontSize: 30}}> {item.amount} </Text>
            </View>
        )
      }
        return (
          <View>
            
            <FlatList 
            data = {dataEx}
            renderItem={renderItem}
            keyExtractor = {item => `${item.id}`}/>
          </View>
        )
    }
    else {  // list for income
      const renderItem = ({item}) => {
        return (
            <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style = {{fontSize: 30}}> {item.type}</Text>
              <Text style = {{fontSize: 30}}> {item.amount} </Text>
            </View>
        )
      }
        return (
          <View>
            <FlatList 
            data = {dataIn}
            renderItem={renderItem}
            keyExtractor = {item => `${item.id}`}/>
          </View>
        )
    }
  }

  function amount() {
    var sum = 0;
    if(ExIn == 1){
      sum = dataEx.reduce((a, b) => (a + b.amount), 0)
      return (
        <Text style = {styles.MoneyText}> {sum} </Text>
      )
    }
    else{
      sum = dataIn.reduce((a, b) => (a + b.amount), 0)
      return (
        <Text style = {styles.MoneyText}> {sum} </Text>
      )
    }
  }
  
  function result() {
    return (
      <View style = {styles.Title}>
        <Text style = {styles.MoneyText}> HK$ </Text>
        {amount()}
      </View>
    )
  }
  
  return (
    
    <SafeAreaView style = {styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
      <View style = {styles.Title}>
        <Text style = {styles.TitleText}>  {currentDate}</Text>
        <TouchableOpacity onPress = {() => navigation.navigate('Add')}>
          <Text style = {styles.TitleText}>+  </Text>
        </TouchableOpacity>
      </View>

      <View style = {styles.ExIn}>
        <TouchableOpacity onPress = {() => setExIn(prevExIn => 1)}>
            <Text style = {styles.ExInText}>Expense</Text>
        </TouchableOpacity>
  
        <Text style = {styles.ExInText}>|</Text>
  
        <TouchableOpacity onPress = {() => setExIn(prevExIn => 2)}>
          <View style = {styles.buttonNumber}>
            <Text style = {styles.ExInText}>Income</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* <View style = {styles.PieChart}>
      
      </View> */}

      <View style = {styles.Title}>
        {result()}
      </View>
      
      <View style = {styles.List}>
        {list()}
       </View> 
       </ScrollView>
     </SafeAreaView>
  );
}

function Add({navigation}){

  const [resultText, setresultText] = useState([]);
  const [ExIn, setExIn] = useState([1]); // 1 for expense; 2 for income
  const [Type, setType] = useState([1]); // 1 for food; 2 for traffic; 3 for fun; 4 for fuel; 5 for medical; 6 for snack; 7 for geocery; 8 for clothing; 9 for bill

  let rows = []
  let nums = [[1, 2, 3], [4, 5, 6], [7, 8, 9], ['.', 0 ,'D']]
  for(let i = 0; i < 4; i++){
    let row = []
    for(let j = 0; j < 3; j++){
      if(nums[i][j] != 'D'){
        row.push(<TouchableOpacity onPress = {() => setresultText([...resultText, nums[i][j]])} style = {styles.NumberButton}>
        <Text style = {{fontSize: 30}}>{nums[i][j]}</Text>
        </TouchableOpacity>)
      }else{
        row.push(<TouchableOpacity onPress = {() => setresultText(prevresultText => '')}
        style = {styles.NumberButton}>
        <Text style = {{fontSize: 30}}>{nums[i][j]}</Text>
       </TouchableOpacity>)
      }
    }
    rows.push(<View style = {styles.NumberRow}>{row}</View>)
  }

  function save() {
    let Name = []
    if(Type == 1){
      Name = 'Food'
    }else if(Type == 2){
      Name = 'Traffic'
    }else if(Type == 3){
      Name = 'Fun'
    }else if(Type == 4){
      Name = 'Fuel'
    }else if(Type == 5){
      Name = 'Medical'
    }else if(Type == 6){
      Name = 'Snacks'
    }else if(Type == 7){
      Name = 'Grocery'
    }else if(Type == 8){
      Name = 'Clothing'
    }else{
      Name = 'Bill'
    }

    var num = 0;
    let length = resultText.length;

    for(let i = 0; i < length; i++){
      if(resultText[i] != '.'){
        num = (num * (10) + resultText[i])
      }
      else{
        break
      }
    }

    if(ExIn == 1){
      // totalEx = totalEx + num
      
      dataEx.push({id: Type, name: Name, amount: num})
    }else {
      // totalIn = totalIn + num
      
      dataIn.push({id: Type, name: Name, amount: num})
    }

    Alert.alert(
      "Saved!",
      " ",[{
        text: "Ok",
        onPress: () => navigation.navigate('Bill')
      }]
    )
  }

   return (

    <SafeAreaView style = {styles.container}>
      <View style = {styles.Title}>
        <Text style = {styles.MoneyText}> HK$ </Text>
        <Text style = {styles.MoneyText}> {resultText} </Text>
      </View>

      <View style = {styles.ExIn}>
        <TouchableOpacity onPress = {() => setExIn(prevExIn => 1)}>
          <Text style = {styles.ExInText}>Expense</Text>
        </TouchableOpacity>
  
        <Text style = {styles.ExInText}>|</Text>
  
        <TouchableOpacity onPress = {() => setExIn(prevExIn => 2)}>
          <Text style = {styles.ExInText}>Income</Text>
        </TouchableOpacity>
      </View>

      <View style = {styles.Type}>
        <TouchableOpacity onPress = {() => setType(preType => 1)}>
            <Image style={styles.Logo}
              source={require('../assets/food.png')} />
          </TouchableOpacity>
      
          <TouchableOpacity onPress = {() => setType(preType => 2)}>
            <Image style={styles.Logo}
              source={require('../assets/traffic.png')} />
          </TouchableOpacity>
      
          <TouchableOpacity onPress = {() => setType(preType => 3)}>
            <Image style={styles.Logo}
             source={require('../assets/fun.png')} />
          </TouchableOpacity>
      
          <TouchableOpacity onPress = {() => setType(preType => 4)}>
            <Image style={styles.Logo}
              source={require('../assets/fuel.png')} />
          </TouchableOpacity>
      
          <TouchableOpacity onPress = {() => setType(preType => 5)}>
            <Image style={styles.Logo}
              source={require('../assets/medical.png')} />
          </TouchableOpacity>
      </View>

      <View style = {styles.Type}>
        <TouchableOpacity onPress = {() => setType(preType => 6)}>
            <Image 
              style={styles.Logo}
              source={require('../assets/snack.png')} />
          </TouchableOpacity>
    
          <TouchableOpacity onPress = {() => setType(preType => 7)}>
            <Image 
              style={styles.Logo}
              source={require('../assets/grocery.png')} />
          </TouchableOpacity>
    
          <TouchableOpacity onPress = {() => setType(preType => 8)}>
            <Image 
              style={styles.Logo}
              source={require('../assets/clothing.png')} />
          </TouchableOpacity>
    
          <TouchableOpacity onPress = {() => setType(preType => 9)}>
            <Image 
              style={styles.Logo}
              source={require('../assets/bill.png')} />
          </TouchableOpacity>
            
          <Image style={styles.Logo} source={require('../assets/blank.png')} />
      </View>

      <View style = {styles.NumberPad}>
        <View style = {styles.Numbers}>
          {rows}
        </View>
      </View>

      <View>
        <Button title = {"Save"} onPress = {() => {save()}}/>
        {/* <Button title = {"Save"} onPress = {save(), HomeScreen.Addfish()}/> */}
      </View>
    </SafeAreaView>
  );
  
}

class AddBilScreen extends React.Component {
    
  render(){

    const Stack = createStackNavigator();
    return(

      <Stack.Navigator initialRouteName="Bill">
        <Stack.Screen name="Bill" component={BillScreen}/>
        <Stack.Screen name="Add" component={Add}/>
      </Stack.Navigator>
    );
    
  }
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  Title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  TitleText:{
    fontSize: 40
  },
  ExIn: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  ExInText: {
    fontSize: 30
  },
  ExInTextBold: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  PieChart: {
    flex: 3,
    backgroundColor: 'yellow'
  },
  List: {
    flex: 3,
  },
  Type: {
    flex: 1,
    flexDirection: 'row'
  },
  Logo: {
    width: 80,
    height: 80
  },
  NumberPad: {
    flex: 4,
    flexDirection: 'row'
  },
  Numbers: {
    flex: 3
  },
  NumberRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  NumberButton: {
    flex: 2,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  SaveText: {
    fontSize: 20,
  },
  MoneyText: {
    fontSize: 40,
    fontWeight: 'bold'
  },
  scrollView: {
    flex: 1,
  }
});

export default AddBilScreen;