<template>
	<view class="container">
		<add-tip :tip="tip" :duration="duration" />
		<view class="notify">
			<image src="../../static/notify.png" class="nofity_image" mode="widthFix" @click="notifyMessage" />
		</view>
		<v-tabs v-model="current" :tabs="tabs" @change="changeTab" class="tab"></v-tabs>
		<view class="coupon" ref="coupon">
			<view class="item" v-for="(v, i) in currentcCoupons" @click="toCoupon(i)" :key="i">
				<view class="top">
					<view class="left">
						<view class="content">
							<image :src="v.icon" class="icon" mode="widthFix" />
							<view class="name">{{ v.name }}</view>
						</view>
					</view>
					<view class="right">点击领取</view>
				</view>
				<view class="bottom">
					<image :src="v.bannerPic" mode="widthFix" />
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import addTip from "../../wxcomponents/struggler-uniapp-add-tip/struggler-uniapp-add-tip.vue"
	export default {
		
		components: {
			addTip
		},
		
		data() {
			return {
				current: 0,
				tabs: [{
						icon: '/static/all.png',
						text: '全部',
						menuId: 0,
					},
					{
						icon: '/static/ele.png',
						text: '饿了么',
						menuId: 1,
					},
					{
						icon: '/static/meituan.png',
						text: '美团',
						menuId: 2,
					},
					{
						icon: '/static/chaoshi.png',
						text: '超市',
						menuId: 3,
					},
				],
				openid: "",
				currentcCoupons: [],
				coupons: [],
				tip: "点击「★添加小程序」，领红包更便捷",
				duration: 5
			};
		},

		onLoad(e) {
			// 获取用户openid
			var that = this
			uni.login({
				success(res) {
					// 请求云函数获取openid
					uniCloud.callFunction({
						name: "fetchopenid",
						data: {
							"code": res.code
						}
					}).then(res => {
						that.openid = res.result.data.openid
					});
				}
			})

			uniCloud.callFunction({
				name: "queryMenu"
			}).then(res => {
				this.tabs = res.result.data
				console.log('菜单结果: ', this.coupons)

			});
			let menuId = e.menuId ? parseInt(e.menuId) : 0
			
			for (let i in this.tabs) {
				if (menuId == this.tabs[i].menuId) {
					this.current = parseInt(i)
				}
			}
			uni.showLoading({
				title: '红包马上就来...'
			});
			uniCloud.callFunction({
					name: 'queryActivities',
				})
				.then(res => {
					uni.hideLoading();
					this.coupons = res.result.data
					this.currentcCoupons = this.coupons
					console.log('优惠券列表: ', this.coupons)
				});
		},
		onShareAppMessage(res) {
			var messages = [{
					title: '美团饿了么大额红包，每日可领！',
					path: '/pages/index/index'
				}, {
					title: '吃了这么多年外卖，你知道这个秘密吗？',
					path: '/pages/index/index'
				},
				{
					title: '红包驾到，点击快速领取？',
					path: '/pages/index/index'
				}
			];
			return messages[Math.floor(Math.random() * messages.length)];
		},
		methods: {

			changeTab(index) {
				console.log('当前选中的项：' + index);
				this.currentcCoupons = []
				uni.showLoading({
					title: '获取优惠中'
				});
				if (index == 0) {
					this.currentcCoupons = this.coupons
				} else {
					for (let i in this.coupons) {
						if (this.coupons[i].menuId == this.tabs[index].menuId) {
							this.currentcCoupons.push(this.coupons[i])
						}
					}
				}
				setTimeout(() => {
					uni.hideLoading()
				}, 500)
			},
			// 订阅消息
			notifyMessage(e) {
				var that = this
				uni.requestSubscribeMessage({
					tmplIds: [getApp().globalData.template_id],
					success(res) {
						if (res[getApp().globalData.template_id] == "accept") {
							uni.showLoading({
								title: "订阅中..."
							})
							uniCloud.callFunction({
								name: "createNotify",
								data: {
									"openid": that.openid,
									"template_id": getApp().globalData.template_id
								},
								success() {
									uni.hideLoading()
									uni.showToast({
										title: "订阅成功，明天记得来领红包哦！",
										icon: "none",
										duration: 2000
									})
								},
								fail() {
									uni.hideLoading()
									uni.showToast({
										icon: false,
										title: "网络错误，请稍后重试！"
									})
								}
							})
						} else {
							uni.showToast({
								title: "您拒绝了小包，可能会忘记领红包哦！",
								icon: "none",
								duration: 2000
							})
						}
					},
					fail(res) {
						console.log(res)
						uni.showToast({
							title: "您拒绝过小包，请从右上角「···」->「设置」-> 「订阅消息」中开启！",
							icon: "none",
							duration: 2500
						})
					},
				})
			},
			toCoupon(i) {
				if (this.currentcCoupons[i].minapp) {
					wx.navigateToMiniProgram({
						appId: this.currentcCoupons[i].minapp.appid,
						path: this.currentcCoupons[i].minapp.path,
						success(res) {
							// 打开成功
						}
					})
				}
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
	}

	.notify {
		width: 100%;
		overflow: hidden;
	}

	.nofity_image {
		width: 100%;
	}

	.container {

		font-size: 14px;
		line-height: 24px;
		position: relative;

		.tab {
			left: 0;
			box-shadow: 2px 2px 10px #D3D3D3;
		}

		.coupon {
			margin-top: 20rpx;

			.item {

				background-color: #FFFFFF;
				margin: 20rpx;
				border-radius: 10rpx;
				padding: 0 30rpx 30rpx 30rpx;
				box-shadow: 2px 2px 10px #D3D3D3;

				.top {
					height: 116rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;


					.left {
						height: 116rpx;
						width: 400rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.content {
							width: 100%;
						}

						.icon {
							display: inline-block;
							vertical-align: bottom;
							width: 52rpx;
							height: auto;
						}

						.name {
							text-align: left;
							display: inline-block;
							vertical-align: bottom;
							font-size: 34rpx;
							color: #000;
							line-height: 50rpx;
							font-weight: bold;
							margin-left: 15rpx;
						}

						.text {
							width: 150rpx;
							height: 38rpx;
							line-height: 38rpx;
							text-align: center;
							font-size: 24rpx;
							color: #61300e;
							background: linear-gradient(90deg, #f9db8d, #f8d98a);
							border-radius: 6rpx;
						}
					}

					.right {
						width: 170rpx;
						height: 60rpx;
						border-radius: 30rpx;
						background: linear-gradient(90deg, #ec6f43, #ea4a36);
						color: #fff;
						font-size: 28rpx;
						line-height: 60rpx;
						text-align: center;
					}
				}

				.bottom {
					height: auto;
					width: 100%;

					image {
						display: block;
						width: 100%;
						height: auto;
					}
				}
			}
		}
	}
</style>
