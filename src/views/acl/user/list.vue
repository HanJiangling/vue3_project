<template>
  <div style="padding: 20px">
    <!-- 搜索框 -->
    <el-form inline>
      <el-form-item label="搜索">
        <el-input placeholder="支部管理员用户名" v-model="keyword" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onsearch"
        >查询</el-button
      >
      <el-button @click="onempty">清空</el-button>
    </el-form>
    <!-- 添加支部管理员 -->
    <div style="marrgin-bottom: 20px">
      <el-button
        text
        @click="dialogVisible = true"
        type="primary"
        icon="el-icon-plus"
      >
        添加支部管理员
      </el-button>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="添加支部管理员"
      width="40%"
      :before-close="handleClose"
    >
      <!-- 对话框内容 -->
      <el-form
        label-width="120px"
        :model="addForm"
        ref="ruleForm"
        :rules="rules"
      >
        <el-form-item label="管理员名字" prop="G_ZH">
          <el-input
            type="text"
            placeholder="支部管理员用户名"
            v-model="addForm.G_ZH"
          />
        </el-form-item>
        <el-form-item label="管理员密码" prop="G_MM">
          <el-input
            type="password"
            placeholder="支部管理员密码"
            v-model="addForm.G_MM"
          />
        </el-form-item>
        <el-form-item label="社区" prop="G_SQ">
          <el-input type="text" placeholder="社区" v-model="addForm.G_SQ" />
        </el-form-item>
        <el-form-item label="党支部" prop="G_DZZ">
          <el-input type="text" placeholder="党支部" v-model="addForm.G_DZZ" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="oncancel">取消</el-button>
          <el-button type="primary" @click="onsubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog
      v-model="dialogVisible1"
      title="分配角色"
      width="60%"
      :before-close="handleClose"
    >
      <!-- 分配角色内容 -->
      <el-form label-width="120px" :model="distributeForm">
        <el-form-item label="角色">
          <el-radio
            v-for="(item, index) in roles"
            v-model="distributeForm.G_SF"
            :key="index"
            :label="item.rolename"
            >{{ item.rolename }}</el-radio
          >
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="ondistribute"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改支部管理员信息 -->
    <el-dialog
      v-model="dialogVisible2"
      title="修改支部管理员"
      width="40%"
      :before-close="handleClose"
    >
      <!-- 对话框内容 -->
      <el-form label-width="120px" :model="modifyForm">
        <el-form-item label="管理员名字">
          <el-input
            type="text"
            placeholder="支部管理员用户名"
            v-model="modifyForm.G_ZH"
          />
        </el-form-item>
        <el-form-item label="管理员密码">
          <el-input
            type="password"
            placeholder="支部管理员密码"
            v-model="modifyForm.G_MM"
          />
        </el-form-item>
        <el-form-item label="社区">
          <el-input type="text" placeholder="社区" v-model="modifyForm.G_SQ" />
        </el-form-item>
        <el-form-item label="党支部">
          <el-input
            type="text"
            placeholder="党支部"
            v-model="modifyForm.G_DZZ"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="onmodify"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 表格区 -->

    <vxe-table
      :align="allAlign"
      :data="
        tableData1.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
    >
      <vxe-table-column field="id" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="G_ZH" title="管理员名字"></vxe-table-column>
      <vxe-table-column field="G_SQ" title="社区"></vxe-table-column>
      <vxe-table-column field="G_DZZ" title="党支部"></vxe-table-column>
      <vxe-table-column field="G_SF" title="角色"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row, column, rowIndex, columnIndex }">
          <el-button
            type="primary"
            icon="el-icon-user"
            title="分配角色"
            circle
            v-if="row.G_QX === '1'"
            disabled
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-user"
            title="分配角色"
            circle
            @click="distributeSwitch(row)"
            v-else
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            title="修改支部管理员"
            circle
            @click="modifySwitch(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            title="删除"
            circle
            v-if="row.G_QX === '1'"
            disabled
          ></el-button>
          <el-button
            v-else
            type="danger"
            icon="el-icon-delete"
            title="删除"
            circle
            @click="ondelete(row)"
          ></el-button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <!-- 分页 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[2, 4, 6, 8]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData1.length"
        prev-text="上一页"
        next-text="下一页"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
// 导入获取支部管理员数据的方法
import {
  getadminusers,
  adduser,
  searchusers,
  deluser,
  updateuser,
  getroles,
  setroles,
} from "../../../api/index";
import _Row from "element-plus/lib/el-row";

export default defineComponent({
  setup() {
    // 搜索
    let keyword = ref("");
    // 搜索管理员方法
    async function onsearch() {
      if (keyword.value === "") {
        ElMessage.error("请输入关键字");
        return;
      }

      let res: any = await searchusers(keyword.value);
      if (res.msg == "error") {
        ElMessage.error("查询数据不存在");
        return;
      } else {
        tableData1.value = res;
      }
    }

    // 清空方法
    async function onempty() {
      keyword.value = ""; //清空搜索关键字
      getallusers();
    }

    // 添加支部管理员
    const dialogVisible = ref(false);
    // 取消添加
    function oncancel() {
      dialogVisible.value = false;
      ruleForm.value.resetFields();
    }
    const addForm = reactive({
      G_ZH: "", //要添加管理员名字
      G_MM: "", //要添加管理员密码
      G_SQ: "", //要添加管理员所在的社区
      G_DZZ: "", //要添加管理员所在的党支部
    });

    //获取添加表单对象
    const ruleForm: any = ref<HTMLElement | null>(null);

    //添加添加管理员的规则
    const rules = reactive({
      //校验管理员规则
      G_ZH: [
        { required: true, message: "支部管理员不能为空", trigger: "blur" },
        {
          message: "输入姓名不符合要求",
          pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
          trigger: "blur",
        },
      ],
      //密码校验规则
      G_MM: [
        {
          required: true,
          message: "管理员密码不能为空",
          trigger: "blur",
        },
        {
          message: "密码为6-8位任意数字字母下划线",
          pattern: /^\w{6,8}$/,
          trigger: "blur",
        },
      ],
      //社区校验规则
      G_SQ: [
        { required: true, message: "内容不能为空", trigger: "blur" },
        {
          message: "输入社区不符合要求",
          pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
          trigger: "blur",
        },
      ],
      //党支部校验
      G_DZZ: [
        { required: true, message: "内容不能为空", trigger: "blur" },
        {
          message: "输入党支部不符合要求",
          pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
          trigger: "blur",
        },
      ],
    });

    // 添加支部管理员方法
    function onsubmit() {
      ruleForm.value.validate(async (valid: any, fields: any) => {
        if (valid) {
          let res: any = await adduser(
            addForm.G_ZH,
            addForm.G_MM,
            addForm.G_SQ,
            addForm.G_DZZ
          );
          if (res.msg === "ok") {
            getallusers();
          }
          dialogVisible.value = false;
        } else {
          console.log("error submit!", fields);
        }
      });
    }
    //分配角色
    const dialogVisible1 = ref(false);

    //定义存储角色信息的变量
    let roles: any = ref("");

    // 分配角色单选框
    let distributeForm = reactive({
      id: "", //分配角色的数据id
      G_SF: "", //分配的角色
    });

    async function getrole() {
      //调用接口
      let res = await getroles();
      roles.value = res;
    }

    function distributeSwitch(row: any) {
      dialogVisible1.value = true;
      //调用获取角色信息的方法
      getrole();
      distributeForm.id = row.id;
      //把分配的角色重新赋值给form2中的G_SF
      distributeForm.G_SF = row.G_SF;
    }
    //分配角色方法
     async function ondistribute() {
      let res: any = await setroles(distributeForm.id, distributeForm.G_SF);
      if (res.msg === "ok") {
        getallusers();
      }
      //关闭模态框
      dialogVisible1.value = false;
    }

    // 修改支部管理员信息
    const dialogVisible2 = ref(false);

    //获取当前要修改的数据
    let modifyForm = reactive({
      id: "", //要修改数据的id
      G_ZH: "", //要添加管理员名字
      G_MM: "", //要添加管理员密码
      G_SQ: "", //要添加管理员所在的社区
      G_DZZ: "", //要添加管理员所在的党支部
    });
    function modifySwitch(row: any) {
      modifyForm.id = row.id;
      modifyForm.G_ZH = row.G_ZH;
      modifyForm.G_MM = row.G_MM;
      modifyForm.G_SQ = row.G_SQ;
      modifyForm.G_DZZ = row.G_DZZ;
      dialogVisible2.value = true;
    }

    // 修改方法
    async function onmodify() {
      //执行修改的主题代码
      let res: any = await updateuser(
        modifyForm.id,
        modifyForm.G_ZH,
        modifyForm.G_MM,
        modifyForm.G_SQ,
        modifyForm.G_DZZ
      );
      if (res.msg === "ok") {
        getallusers();
      }
      //关闭模态框
      dialogVisible2.value = false;
    }

    // 删除数据
    async function ondelete(row: any) {
      let id = row["id"];
      let res: any = await deluser(id);
      if (res.msg === "ok") {
        getallusers();
      }
    }

    // 关闭对话框
    const handleClose = (done: () => void) => {
      ElMessageBox.confirm("您确定要关闭吗?")
        .then(() => {
          done();
          ruleForm.value.resetFields();
        })
        .catch(() => {
          // catch error
        });
    };
    // 表格数据
    const allAlign = ref(null);

    // 在实列挂载完成后获取支部管理员的数据;
    const tableData1: any = ref("");
    onMounted(() => {
      getallusers();
    });

    async function getallusers() {
      let res = await getadminusers();
      tableData1.value = res;
    }

    //当前页
    const currentPage = ref(1);
    //每页显示的数据条数
    const pageSize = ref(2);

    const name = "江哥";
    const pass = "12345";
    const community = "点点社区";
    const team = "第一党支部";
    return {
      dialogVisible,
      dialogVisible1,
      dialogVisible2,
      handleClose,
      allAlign,
      tableData1,
      currentPage,
      pageSize,
      distributeForm,
      name,
      pass,
      community,
      team,
      addForm,
      onsubmit,
      ruleForm,
      rules,
      keyword,
      onsearch,
      onempty,
      ondistribute,
      oncancel,
      ondelete,
      distributeSwitch,
      modifySwitch,
      onmodify,
      modifyForm,
      roles,
    };
  },
});
</script>
<style  scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>