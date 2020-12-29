<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		globalData: {
			"appid": '请填写自己小程序id', // 在小程序后台查看
			"secret": '请填写自己小程序appsecret', // 在小程序后台查看
			"template_id": "请填写自己小程序订阅消息的templateid" // 在小程序后台申请查看
		}
	};
</script>

<style>

</style>
