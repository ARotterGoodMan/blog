<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center">
      <div class="card p-4 shadow" style="width: 700px">
        <h3 class="text-center mb-3"><i class="fas fa-user"></i> 个人信息</h3>

        <!-- 头像预览 -->
        <div class="text-center mb-3">
          <img
            src="@/assets/img/logo.png"
            alt="User Avatar"
            class="rounded-circle"
            width="80"
            height="80"
          />
        </div>

        <!-- Tab 切换 -->
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#basic">基础信息
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#contact">联系方式
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#address">地址信息
            </button>
          </li>
        </ul>

        <!-- Tab 内容 -->
        <div class="tab-content">
          <!-- 基础信息 -->
          <div class="tab-pane fade show active" id="basic">
            <div class="row">
              <div class="mb-3 col-md-6">
                <label class="form-label">用户名</label>
                <input v-model="user.username" type="text" class="form-control"
                       disabled/>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">邮箱
                  <span style="color:#f00;font-size:.75rem">用于登录无法修改</span>
                </label>
                <input v-model="user.email" type="email" class="form-control" disabled/>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">姓名</label>
                <input v-model="editableProfile.name" type="text" class="form-control"
                       :disabled="!isEditing"/>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">性别</label>
                <select v-model="editableProfile.sex" class="form-control" :disabled="!isEditing">
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="保密">保密</option>
                </select>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">生日</label>
                <input v-model="editableProfile.birth_date" type="date" class="form-control"
                       :disabled="!isEditing"/>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">头像</label>
                <input v-model="editableProfile.avatar" type="url" class="form-control"
                       placeholder="请输入头像URL" :disabled="!isEditing"/>
              </div>
            </div>
          </div>

          <!-- 联系方式 -->
          <div class="tab-pane fade" id="contact">
            <div class="row">
              <div class="mb-3 col-md-12">
                <label class="form-label">手机号</label>
                <input v-model="editableProfile.phone" type="text" class="form-control"
                       :disabled="!isEditing"/>
              </div>
            </div>
          </div>

          <!-- 地址信息 -->
          <div class="tab-pane fade" id="address">
            <div class="row">
              <div class="mb-3 col-md-6">
                <label class="form-label">省份</label>
                <select v-model="editableProfile.province" class="form-control"
                        :disabled="!isEditing" @change="handleProvinceChange">
                  <option value="">请选择省份</option>
                  <option v-for="(cities, provinceName) in provinceCityMap" :key="provinceName"
                          :value="provinceName">
                    {{ provinceName }}
                  </option>
                </select>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">城市</label>
                <select v-model="editableProfile.city" class="form-control" :disabled="!isEditing">
                  <option value="">请选择城市</option>
                  <option v-for="city in availableCities" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">地址</label>
                <input v-model="editableProfile.address" type="text" class="form-control"
                       :disabled="!isEditing"/>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">邮编</label>
                <input v-model="editableProfile.postal_code" type="text" class="form-control"
                       :disabled="!isEditing"/>
              </div>
            </div>
          </div>
        </div>

        <!-- 统一底部按钮 -->
        <div class="card-buttons">
          <div>
            <template v-if="!isEditing">
              <button class="btn btn-primary" @click="toggleEditMode">
                <i class="fas fa-edit"></i> 编辑
              </button>
            </template>
            <template v-else>
              <button class="btn btn-success" @click="saveChanges">
                <i class="fas fa-save"></i> 保存
              </button>
            </template>
          </div>
          <div>
            <template v-if="!isEditing">
              <button class="btn btn-info" @click="toggleLogout">
                <i class="fas fa-sign-out-alt"></i> 退出
              </button>
            </template>
            <template v-else>
              <button class="btn btn-secondary" @click="toggleEditMode">
                <i class="fas fa-times"></i> 取消
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted, watch} from 'vue'
import router from '@/router'
import {Serverd} from "@/tools/Server.ts"
import {useGlobalStore} from "@/config/global"

const global = useGlobalStore()

interface User {
  username: string
  email: string
  avatar: string
  isAdmin: number
  token: string
  is_login: boolean
}

interface UserProfile {
  name: string
  sex: '男' | '女' | '保密'
  birth_date?: string | null
  phone?: string
  address?: string
  city?: string
  province?: string
  postal_code?: string
  avatar?: string
}

const user = ref<User>({
  username: global.user.username,
  email: global.user.email,
  avatar: global.user.avatar,
  isAdmin: global.user.isAdmin,
  token: global.user.token,
  is_login: global.user.is_login
})

const profile = ref<UserProfile>({
  name: '',
  sex: '保密',
  birth_date: null,
  phone: '',
  address: '',
  city: '',
  province: '',
  postal_code: '',
  avatar: ''
})

const editableProfile = reactive<UserProfile>({
  name: '',
  sex: '保密',
  birth_date: null,
  phone: '',
  address: '',
  city: '',
  province: '',
  postal_code: '',
  avatar: ''
})

const isEditing = ref(false)

// 省市数据（全国）
const provinceCityMap: Record<string, string[]> = {
  "北京": ['北京市'],
  "天津": ['天津市'],
  "上海": ['上海市'],
  "重庆": ['重庆市'],
  "河北": ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'],
  "山西": ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'],
  "辽宁": ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'],
  "吉林": ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边朝鲜族自治州'],
  '黑龙江': ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市', '大兴安岭地区'],
  "江苏": ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
  "浙江": ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
  "安徽": ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市'],
  "福建": ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'],
  "江西": ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'],
  "山东": ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'],
  "河南": ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市'],
  '湖北': ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施土家族苗族自治州'],
  '湖南': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州'],
  '广东': ['广州市', '深圳市', '珠海市', '汕头市', '韶关市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
  "广西": ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'],
  "海南": ['海口市', '三亚市', '三沙市', '儋州市'],
  '四川': ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'],
  "贵州": ['贵阳市', '六盘水市', '遵义市', '安顺市', '毕节市', '铜仁市', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
  "云南": ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州', '大理白族自治州', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州'],
  "西藏": ['拉萨市', '日喀则市', '昌都市', '林芝市', '山南市', '那曲市', '阿里地区'],
  "陕西": ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
  "甘肃": ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏回族自治州', '甘南藏族自治州'],
  "青海": ['西宁市', '海东市', '海北藏族自治州', '黄南藏族自治州', '海南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'],
  "宁夏": ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
  "新疆": ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市', '昌吉回族自治州', '博尔塔拉蒙古自治州', '巴音郭楞蒙古自治州', '阿克苏地区', '克孜勒苏柯尔克孜自治州', '喀什地区', '和田地区', '伊犁哈萨克自治州', '塔城地区', '阿勒泰地区'],
  "香港": ['香港特别行政区'],
  "澳门": ['澳门特别行政区'],
  "台湾": ['台北市', '高雄市', '台中市', '台南市', '新北市', '基隆市', '新竹市', '嘉义市']
}

const availableCities = ref<string[]>([])

// 获取用户资料
const fetchProfile = async () => {
  try {
    const res = await Serverd.get_profile()
    if (res.status === 200) {
      // 处理返回的用户资料
      profile.value = res.data.data

      // 处理生日日期格式
      if (profile.value.birth_date) {
        const birthDate = new Date(profile.value.birth_date)
        const year = birthDate.getFullYear()
        const month = (birthDate.getMonth() + 1).toString().padStart(2, '0')
        const day = birthDate.getDate().toString().padStart(2, '0')
        profile.value.birth_date = `${year}-${month}-${day}`
      }

      // 更新可编辑数据
      Object.assign(editableProfile, profile.value)

      // 初始化城市选择
      if (editableProfile.province) {
        availableCities.value = provinceCityMap[editableProfile.province] || []
      }
    } else {
      console.error('获取用户资料失败:', res)
    }
  } catch (err) {
    console.error('获取用户资料异常:', err)
  }
}

onMounted(() => {
  fetchProfile()
})

function handleProvinceChange() {
  availableCities.value = provinceCityMap[editableProfile.province || ''] || []
  if (!availableCities.value.includes(editableProfile.city || '')) {
    editableProfile.city = ''
  }
}

function toggleLogout() {
  if (confirm('确定要退出登录吗？')) {
    sessionStorage.removeItem('user')
    Serverd.logout()
    global.setUser({
      username: '',
      email: '',
      avatar: '',
      isAdmin: 0,
      token: '',
      is_login: false
    })
    router.push('/login')
  }
}

function toggleEditMode() {
  // 如果是取消编辑，恢复数据
  if (isEditing.value) {
    Object.assign(editableProfile, profile.value)

    // 重新初始化城市选择
    if (editableProfile.province) {
      availableCities.value = provinceCityMap[editableProfile.province] || []
    }
  }
  isEditing.value = !isEditing.value
}

async function saveChanges() {
  try {
    const res = await Serverd.update_profile(editableProfile)
    if (res.status === 200) {
      // 更新成功，更新全局状态
      Object.assign(profile.value, editableProfile)

      // 更新头像显示
      if (editableProfile.avatar) {
        user.value.avatar = editableProfile.avatar
      }

      isEditing.value = false
      alert('保存成功！')
    } else {
      alert('保存失败: ' + (res.data.message || '未知错误'))
    }
  } catch (err) {
    console.error('保存异常:', err)
    alert('保存异常: ' + (err || '未知错误'))
  }
}

// 监听省份变化，更新城市列表
watch(() => editableProfile.province, (newProvince) => {
  if (newProvince) {
    availableCities.value = provinceCityMap[newProvince] || []
  } else {
    availableCities.value = []
  }
})

</script>

<style scoped>
img {
  object-fit: cover;
}

.card {
  max-width: 700px;
  height: calc(100vh - 122px);
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .card {
    width: 100% !important;
    min-height: calc(100vh - 122px); /* 改为min-height适应内容 */
    margin: 10px;
    padding: 15px;
  }

  .container {
    padding: 0;
  }
}

.tab-content {
  flex: 1;
  overflow: visible;
}

/* 底部按钮固定，左右分布 */
.card-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

/* 响应式调整 */
@media (max-width: 576px) {
  .card-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .card-buttons > div {
    width: 100%;
  }

  .card-buttons button {
    width: 100%;
  }
}
</style>

