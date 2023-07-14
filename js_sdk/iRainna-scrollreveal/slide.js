export default {
		props: {
			slideWidth: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				touchStartX: "",
				isTouchMove: false, //向左滑动：true,显示删除按钮
				screenWidth: 0
			};
		},
		created() {
			const {
				screenWidth
			} = uni.getSystemInfoSync();
			this.screenWidth = screenWidth;
			console.log(screenWidth);
			uni.$on("slide-close", () => {
				console.log("slide-close");
				this.isTouchMove = false;
			});
		},

		methods: {
			touchStartHandle(e) {
				this.touchStartX = e.changedTouches[0].clientX;
			},
			touchEndHande(e) {
				const touchStartX = this.touchStartX;
				const touchEndX = e.changedTouches[0].clientX;
				//向左滑动touchEndX < touchStartX
				if (touchStartX - touchEndX > 80) {
					uni.$emit("slide-close");
					this.isTouchMove = true;
				} else {
					this.isTouchMove = false;
				}
			},
		}
	};