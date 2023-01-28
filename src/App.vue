<script>
export default {
	onLaunch: function() {
		console.log('App Launch')
		// this.patchRouterMethod()
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	},

	methods: {
		patchRouterMethod() {
			const methodToPatch = ['navigateTo', 'redirectTo', 'switchTab', 'navigateBack']
			methodToPatch.map(item => {
				const original = uni[item] //
				uni[item] = function(opt = {}, needAuth) {
					const token = uni.getStorageSync('accessToken')
					const needLogin = opt.url && opt.url.indexOf('needLogin=true')
					if ((needAuth || needLogin > -1) && !(token !== undefined && token.length > 0)) {
						// 需要登录且未登录
						uni.navigateTo({
							url: '/pages/login/index'
						})
					} else {
						return original.call(this, opt)
					}
				}
			})
		}
	}
}
</script>

<style lang="scss">
// 因APP使用了nvue 除APP外加载样式 进行过滤 防止报错
/*  #ifndef  APP-PLUS-NVUE */
// 公共css
@import './style/common.scss';
// 便捷css
@import './style/base.scss';
// iconfont
@import './style/iconfont.scss';
// uview scss
@import 'uview-ui/index.scss';
/*  #endif  */
</style>
