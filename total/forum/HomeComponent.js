import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import HomePageList from './HomeListView'
import { Feather } from '@expo/vector-icons';
import ActionButton from 'react-native-action-button'
import { useNavigation } from '@react-navigation/native';

const DataFetch = require('./jiekou');

class HomePost extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          networkErr:0, //0:无异常 1:网路异常 2:超时
          showSelect:false,
          refreshed:true,
        }
    }

    _getData = async (mode=1, postNum = 10)=>{
        let timeThreshold = new Promise((resolve,reject)=>{
          setTimeout(()=>{
              reject(2);
          },10000);  //设置10s的超时阈值
        });

        let errDetect = 0;
        let postDate = await Promise.race([timeThreshold,DataFetch._getPostDateAsync(1,postNum)]) //直接请求post
        .then((value)=>{
            return value;
        })
        .catch((err)=>{
            errDetect = err;
            this.setState({networkErr:err});
            return [];
        });

        if(errDetect != 0)
          return([]);
        else
          return(postDate);
    }

    _onFetch = async (page = 1, startFetch, abortFetch)=>{
        try{
          let pageLimit = 10; //设置一页显示的条目数
          let rowData = [];
          
          rowData = await this._getData(1,pageLimit);  //直接请求post，1对应post在数据库中的type的值，可以修改
          //开始提取数据
          console.log(`数据获取完毕-${page}`);
          console.log(rowData);
          startFetch(rowData, pageLimit);
          if(!this.state.refreshed) this.setState({refreshed:true});
        } catch(err){
          //err为网络参数
            abortFetch(); //停止
        }
    }
    
    _refresh = async () => {
        console.log('开始刷新');
        try{
          let rowData = [];

          rowData = await this._getData(this.state.selectMode,5);
          console.log(rowData);
          console.log(this.listView.state.dataSource);
          let newData = rowData.concat(this.listView.state.dataSource);
          this.listView.updateDataSource(newData);
          this.setState({refreshed:true});
        } catch(err){
          console.log('刷新时发生网络异常');
        }
    }

    _emptyView = () => {
        return(
          <View style={styles.container}>
              <Text style={styles.text}>
                  {this.state.networkErr==2?'网络好像延时很高哦':
                  this.state.networkErr==1?'网络好像出现了故障':
                  '没有找到任何内容'}
              </Text>
          </View>
        );
    }

    //刚开始获取数据时显示的内容
    _renderPaginationFetchingView = () => {
        return(
            <View style={styles.container}>
                <Text style={styles.text}>正在获取数据</Text>
            </View>
        );
    }

    _renderItem = (item, index) => {
        console.log("renderItem in homepage:",item);
          return(
            <TouchableOpacity
                onPress={(event)=>{this.props.navigation.navigate('PostDetail',{post_id:item.id})}}
                activeOpacity={0.7}
            >
               <View style={styles.post}>
                  <Text style={styles.postHeader}>
                    {`#水贴# ${item.title}`}
                  </Text>
                  <Text style={styles.postDate}>
                    {this._formatDateString(item.update_date)}
                  </Text>
                  <Text style={styles.postContent}>
                    <Text style={styles.poster}>{`${item.user_id}:`}</Text>
                    {item.content}
                  </Text>
                  <View style={styles.postView}>
                    <Feather name='eye' color='black' size={styles.postView.height-5}/>
                    <Text style={{height:styles.postView.height,paddingLeft:5,fontSize:styles.postView.height-5}}>{item.view_num}</Text>
                  </View>
               </View>
            </TouchableOpacity>
          );
    }

    _formatDateString = (timestamp)=>{
        let time = new Date(timestamp);
        return(`${time.getFullYear()}-${time.getMonth()}-${time.getDate()}`);
    }

    _renderSeperator = () =>{
        return(
            <View style={{height:1,backgroundColor:'#E6E6FA'}}></View>
        );
    }

    render(){
        return(
          <>
            <HomePageList
                ref={(ref)=>this.listView = ref}
                keyExtractor={(item,index)=> `${item.id}-${index}`}
                getItemLayout={(data,index)=>({
                  length:styles.post.height,
                  offset:(styles.post.height+1)*index,
                  index
                })}
                onFetch={this._onFetch}
                item={this._renderItem}
                emptyView={this._emptyView}
                separator={this._renderSeperator}
                refreshableMode='advanced'
                refreshableTitlePull='下拉刷新'
                refreshableTitleRelease='松手刷新'
                refreshableTitleRefreshing='正在加载。。。'
                displayDate={true}
                refresh={this._refresh}
            />
            <MyPostComponent userInfo={{...this.props.route.params}}/>
          </>
        );
    }
}

class HomeAnnounce extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          networkErr:0, //0:无异常 1:网路异常 2:超时
          showSelect:false,
          refreshed:true,
        }
    }

    _getData = async (mode=0, postNum = 10)=>{
        let timeThreshold = new Promise((resolve,reject)=>{
          setTimeout(()=>{
              reject(2);
          },10000);  //设置10s的超时阈值
        });

        let errDetect = 0;
        let postDate = await Promise.race([timeThreshold,DataFetch._getPostDateAsync(0,postNum)]) //直接请求announcement
        .then((value)=>{
            return value;
        })
        .catch((err)=>{
            errDetect = err;
            this.setState({networkErr:err});
            return [];
        });

        if(errDetect != 0)
          return([]);
        else
          return(postDate);
    }

    _onFetch = async (page = 1, startFetch, abortFetch)=>{
        try{
          let pageLimit = 10; //设置一页显示的条目数
          let rowData = [];
          
          rowData = await this._getData(0,pageLimit);  //直接请求announcememnt，0对应公告在数据库中的type的值，可以修改
          //开始提取数据
          console.log(`数据获取完毕-${page}`);
          console.log(rowData);
          startFetch(rowData, pageLimit);
          if(!this.state.refreshed) this.setState({refreshed:true});
        } catch(err){
          //err为网络参数
            abortFetch(); //停止
        }
    }
    
    _refresh = async () => {
        console.log('开始刷新');
        try{
          let rowData = [];

          rowData = await this._getData(this.state.selectMode,5);
          console.log(rowData);
          console.log(this.listView.state.dataSource);
          let newData = rowData.concat(this.listView.state.dataSource);
          this.listView.updateDataSource(newData);
          this.setState({refreshed:true});
        } catch(err){
          console.log('刷新时发生网络异常');
        }
    }

    _emptyView = () => {
        return(
          <View style={styles.container}>
              <Text style={styles.text}>
                  {this.state.networkErr==2?'网络好像延时很高哦':
                  this.state.networkErr==1?'网络好像出现了故障':
                  '没有找到任何内容'}
              </Text>
          </View>
        );
    }

    //刚开始获取数据时显示的内容
    _renderPaginationFetchingView = () => {
        return(
            <View style={styles.container}>
                <Text style={styles.text}>正在获取数据</Text>
            </View>
        );
    }

    _renderItem = (item, index) => {
        console.log("renderItem in homepage:",item);
          return(
            <TouchableOpacity
                onPress={(event)=>{this.props.navigation.navigate('PostDetail',{post_id:item.id})}}
                activeOpacity={0.7}
            >
               <View style={styles.post}>
                  <Text style={styles.postHeader}>
                    {`#公告# ${item.title}`}
                  </Text>
                  <Text style={styles.postDate}>
                    {this._formatDateString(item.update_date)}
                  </Text>
                  <Text style={styles.postContent}>
                    <Text style={styles.poster}>{`${item.user_id}:`}</Text>
                    {item.content}
                  </Text>
                  <View style={styles.postView}>
                    <Feather name='eye' color='black' size={styles.postView.height-5}/>
                    <Text style={{height:styles.postView.height,paddingLeft:5,fontSize:styles.postView.height-5}}>{item.view_num}</Text>
                  </View>
               </View>
            </TouchableOpacity>
          );
    }

    _formatDateString = (timestamp)=>{
        let time = new Date(timestamp);
        return(`${time.getFullYear()}-${time.getMonth()}-${time.getDate()}`);
    }

    _renderSeperator = () =>{
        return(
            <View style={{height:1,backgroundColor:'#E6E6FA'}}></View>
        );
    }

    render(){
        return(
          <>
            <HomePageList
                ref={(ref)=>this.listView = ref}
                keyExtractor={(item,index)=> `${item.id}-${index}`}
                getItemLayout={(data,index)=>({
                  length:styles.post.height,
                  offset:(styles.post.height+1)*index,
                  index
                })}
                onFetch={this._onFetch}
                item={this._renderItem}
                emptyView={this._emptyView}
                separator={this._renderSeperator}
                refreshableMode='advanced'
                refreshableTitlePull='下拉刷新'
                refreshableTitleRelease='松手刷新'
                refreshableTitleRefreshing='正在加载。。。'
                displayDate={true}
                refresh={this._refresh}
            />
            <MyPostComponent userInfo={{...this.props.route.params}}/>
          </>
        );
    }
}

function MyPostComponent({userInfo}){
    const navigation = useNavigation();

    return(
        <ActionButton
            size={40}
            buttonColor='rgba(255,140,0,1)'  //这里可以修改发布按钮的底色
            offsetX={30}
            offsetY={30}
            onPressIn={(event)=>{navigation.navigate('PostPage',{...userInfo})}}
            renderIcon={()=>(<Feather name='plus' color='#ffffff' size={40}/>)}
        >
        </ActionButton>
    );
}

const styles = StyleSheet.create({
    /**
     * 这里是UI，保证各个页面的UI在这里修改
     */
        container:{
            flex:1,
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
        },
        text:{
            fontSize:18,
            fontStyle:'italic',
            color:'red',
            backgroundColor:'#AEEEEE',
            height:24,
            textAlignVertical:'center',
            textAlign:'center',
        },
        post:{
            flexDirection:'column',
            height:300,
            backgroundColor:'#DCDCDC',
            paddingLeft:10,
            paddingRight:10,
        },
        poster:{
            fontSize:24,
            fontWeight:'bold',
            fontStyle:'italic',
            color:'#1E90FF'
        },
        postHeader:{
            height:60,
            fontSize:36,
            paddingTop:20,
        },
        postContent:{
            fontSize:24,
            height:180,
        },
        postDate:{
            height:20,
            fontSize:16,
            textAlignVertical:'center',
        },
        postView:{
            height:25,
            flexDirection:'row',
            justifyContent:'flex-start',
            alignItems:'center',
        },
        select:{  //下拉列表在homePage中的style
            height:18,
            flexDirection:'row',
            justifyContent:'flex-end',
            paddingEnd:20,
        },
        selectItem:{ //下拉列表的每一行的style
            height:18,
            alignItems:'center',
        },
        selectText:{ //下拉列表中每一行中的文本的style
            fontSize:14,
            marginTop:2,
        },
});

export {HomePost, HomeAnnounce};