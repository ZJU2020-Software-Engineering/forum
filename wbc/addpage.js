import  React,{Component,useState} from 'react';
import { Button, View, Text,TextInput,StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function addpage({ navigation }) {
    const [post_title, setPost_title] = useState('');
    const [post_content, setPost_content] = useState('');
    let post_messege={'post_title':post_title,'post_type':1,"user_id":123456,'user_name':'用户1',
'post_content':post_content};

    return (
      <View style={{ flex: 1, flexDirection:'column' }}>
        
        <TextInput style={{paddingTop: 50,paddingBottom:50}} 
        multiline={true}
        placeholder='输入帖子标题'
        onChangeText={post_title => setPost_title(post_title)}/>
        <TextInput style={{paddingTop: 50,paddingBottom:200}} 
        multiline={true}
        placeholder='输入帖子内容'
        onChangeText={post_content => setPost_content(post_content)}/>
        
      
        
        <Button title="发布"  onPress={ ()=>{
          if(post_title=='')
          {
            alert('标题为空')
          }
          else if(post_content=='')
          {
            alert('内容为空')
          }
          else{
          fetch('http://192.168.50.11:8088/forum/post/create/',{
              method:'POST',
              headers:{"Accept": "application/json",
              "Content-Type": 'application/json',          
              "Connection": "close",             
              },
              body: JSON.stringify(post_messege),
          }).then((response)=>response.json()
          .then(function(json){
            alert(json.state)
          })
          )
          .catch((error)=>{console.error(error)})
          navigation.goBack()
        }
        }} />
    
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    title_view:{
      flexDirection:'row',
      height:50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#27b5ee',
    },
    title_text: {
      fontSize:20,
      color:'white'
    },
    list: {
      flex: 1,
      paddingTop: 22
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
  });