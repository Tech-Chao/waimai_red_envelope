# 美团饿了吗CPS红包，别人领红包下单，你拿推广佣金


<img src="https://img-blog.csdnimg.cn/20201208152733362.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l1d3VjaGFpbw==,size_16,color_FFFFFF,t_70#pic_center" width="300"/>



### 使用方法

源码为uniapp项目，需下载hbuilder（小程序开发者工具也需要下载用于项目运行、发布）导入项目打包，可编译成小程序。



## 前序准备

1.  注册美团联盟和淘宝联盟，tip：美团联盟个人无法注册，可以挂靠在企业帐号下（目前有很多联盟如 ：订单侠）。如何注册见下面常见问题。
2. 你需要在本地安装  [hbuilderx](https://www.dcloud.io/hbuilderx.html)。本外卖红包版本属于云开发版本还需开通 [云开发](https://unicloud.dcloud.net.cn/)。目前本项目采用腾讯云开发，每个月有免费的流量、空间等，足够项目前期启动。
3. [小程序注册](https://mp.weixin.qq.com/)注册完成后获取小程序id和AppSecret，订阅消息模板也在小程序后台创建查看。`appid`、`secret`、`template_id`均在「App.vue」文件中填写

## UI接口相关

### 创建云服务空间

HbuilderX 开项目右键选中目录下 cloudfunctions 文件夹，选择 创建云服务空间，会自动打开 [云开发首页](https://unicloud.dcloud.net.cn/home)，选择腾讯云，填写信息创建。
### 关联云服务空间
回到HbuilderX，右键  cloudfunctions 关联云服务空间，选择刚刚创建的云服务空间。
### 上传云函数
右键  cloudfunctions 上传所有云函数（如提示请在manifest.json文件中获取新的AppID，打开manifest.json重新获取appid）。

### 初始化云数据库
回到HbuilderX，右键  cloudfunctions  目录下的 db_init.json ，初始化云数据库。（**记得初始化之前将ActivityTable表中「minapp」-「path」替换成自己的推广路径，不然就白帮我推广啦**，如何获得推广路径看常见问题）初始化后可在云服务空间->云数据库 看到有三个数据表，SubscribeMessageTable 是订阅消息的用户信息表，CouponMenuTable是菜单栏表，ActivityTable是优惠券活动表。

在云服务空间管理后台中，ActivityTable、CouponMenuTable两个表可以编辑、修改。SubscribeMessageTable 只能通过用户点击订阅新增才能完成推送，自己在数据库添加的数据无效。

PS： 以上三个表的名字可以自定义，只需要你小程序中的云函数中对应的名字改成一致就行。

## 订阅相关

小程序后台管理界面中 -> 「订阅消息」添加一个新的模板后复制模板ID到项目中 App.vue 的template_id中。

在云服务空间中，SubscribeMessageTable 表是当天订阅过消息的用户数据，小程序的消息订阅目前只支持一次性订阅，意即用户点击一次订阅，我们只能发送一次消息。我们可以设置云函数中的 sendSubscribe 设置为每天上午 10点半 开始发送订阅消息。详细的设置过程， 在云函数列表中找到sendSubscribe 点击 「详细」菜单 -> 「定时器触发」，编辑输入

```
// 每天的 10 点 30 分钟就会触发函数，我们可以更改对应的时间。
[
  {
    "name": "waimaiTrigger",
    "type": "timer",
    "config": "0 30 10 * * * *"
  }
]
```
[定时触发时间设置格式的具体规则](https://uniapp.dcloud.io/uniCloud/trigger)


## 常见问题
- 如何获取美团饿了吗的推广链接

美团联盟：https://union.meituan.com/

饿了么、双十一：https://pub.alimama.com/


-  如何获取自己的推广地址：
前置条件你需要知道如何获取小程序的路径地址，请参考：[如何获取小程序路径](https://mp.weixin.qq.com/s/JHDWqBvntD0-p-dXEntSQQ)。

知道如何获取小程序路径后我们就是要在「饿了么」、「美团」小程序要获取自己的推广的小程序路径啦：

1. 饿了么： 下载打开「淘宝联盟」，使用淘宝登录后再首页找到「吃喝玩乐」项目。目前推广有【饿了么微信活动】、【饿了么满减券】、【饿了么生鲜超市】，点击项目进入，分享图片-微信小程序码。在微信中扫描打开，获取小程序路径后修改我们项目中数据表ActivityTable中的path字段

2. 美团：美团不提供个人推广，虽然推出了「外卖美天赚」公众号，但我试过个人推广的佣金不到5%，所以转用了第三方联盟。我用的是「订单侠」三方提供的推广。给到了是 5.6% 佣金，平台抽 0.4%。 美团生成的小程序路径可以直接通过工具生成：https://www.dingdanxia.com/tool/meituan_privilege。生成完后记得覆盖项目中数据表ActivityTable中的path字段。

**PS:记得修改path字段、记得修改path字段、记得修改path字段如下：**

```
minapp: {
    appid: 'wxece3a9a4c82f58c9',
    path: 'pages/sharePid/web/index?scene=https://s.click.ele.me/wR9ecuu'
}
```

- 如何配置优惠券图片

在uni-cloud 中除了云函数、云数据库还有云储存，将你要替换的图片上传到云储存中，然后点击「详情」获取图片的url，再替换掉在云数据库中的bannerPic、icon字段。

## 参考

[zwpro/coupons](https://github.com/zwpro/coupons)

[leixiaokou/waimai-cps](https://github.com/leixiaokou/waimai-cps)