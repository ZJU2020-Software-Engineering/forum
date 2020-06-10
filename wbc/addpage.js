import  React,{Component,useState} from 'react';
import { Button, View, Text,TextInput,StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ImagePicker from 'react-native-image-picker';
import queryString from 'query-string';
export default function addpage({ navigation }) {
    const [source, setSource]= useState('');
    const [post_title, setPost_title] = useState('');
    const [post_content, setPost_content] = useState('');
    let post_messege={'post_title':post_title,'post_type':1,"user_id":123456,'user_name':'用户1',
    'post_content':post_content};
    let formData = new FormData();
    let file={uri:source, type: 'multipart/form-data',name:post_title+'_pic'}
    return(
      <View style={{ flex: 1, flexDirection:'column' }}>
        
        <TextInput style={{paddingTop: 50,paddingBottom:50}} 
        multiline={true}
        placeholder='输入帖子标题'
        onChangeText={post_title => setPost_title(post_title)}/>
        <TextInput style={{paddingTop: 50,paddingBottom:200}} 
        multiline={true}
        placeholder='输入帖子内容'
        onChangeText={post_content => setPost_content(post_content)}/>
        
      
        <View style={styles.button}>
        <Button 
        title="选择照片或拍照"
        onPress={cameraAction=()=>{
          ImagePicker.showImagePicker(options, (response) => {
            if (!response.error) {
                if (response.didCancel) {
                    return;
                }
                setSource ({uri: response.uri});
                this.base64 = response.data;
                this.fileURI =  response.uri;
                this.fileName = response.fileName || 'cash.jpg';
                this.fileType = response.type;

            }

        });
      }
      }
      />
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
           // alert(json.state)
          })
          )
          .catch((error)=>{console.error(error)})
          if(source!='')//上传图片
          {
          let formData = new FormData();  //因为需要上传多张图片,所以需要遍历数组,把图片的路径数组放入formData中
          let file = {uri: this.fileURI, type: 'multipart/form-data', name: this.fileName};   //这里的key(uri和type和name)不能改变,
          formData.append("file",file);   //这里的file就是后台需要的key
            fetch('https://192.168.50.11:8088/forum/post/createpic/',{
            method:'POST',
            headers: {    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  },
        body:queryString.stringify(formData),
    })
          }
          alert(this.fileName)
          navigation.goBack()
        }
        }} />
      </View>
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
    button:{
      flexDirection: 'row',
      justifyContent: 'space-around',
    }
  });
  const options = {
    title: '从相册选择或拍摄',
    chooseFromLibraryButtonTitle: '从相册选择',
    takePhotoButtonTitle: '拍摄',
    cancelButtonTitle: '取消',
    storageOptions: {
        skipBackup: true,
    },
};