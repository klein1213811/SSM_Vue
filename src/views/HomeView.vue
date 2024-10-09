<template>
  <div>
    <div style="margin: 10px 5px">
      <el-button type="primary" @click="add">新增</el-button>
      <el-button>其他</el-button>
    </div>
    <!--搜索-->
    <div style="margin: 10px 5px">
      <el-input v-model="search" style="width: 30%" placeholder="请输入关键字"/>
      <el-button style="margin-left: 10px" type="primary" @click="list">搜索</el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
          prop="id"
          label="ID"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="name"
          label="家居名"
      >
      </el-table-column>
      <el-table-column
          prop="maker"
          label="厂家">
      </el-table-column>
      <el-table-column
          prop="price"
          label="价格">
      </el-table-column>
      <el-table-column
          prop="sales"
          label="销量">
      </el-table-column>
      <el-table-column
          prop="stock"
          label="库存">
      </el-table-column>

      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <!--scope.row表示当前行的数据-->
          <el-button link type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除该条记录吗?" @confirm="handleDel(scope.row.id)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加家居的弹窗
        说明:
        1. el-dialog ：v-model="dialogVisible" 表示对话框, 和dialogVisible 变量双向
        绑定,控制是否显示对话框
        2. el-form :model="form" 表示表单,数据和form 数据变量双向绑定
        3. el-input v-model="form.name" 表示表单的input 空间，名字为name 需要和
        后台Javabean 属性一致
    -->
    <el-dialog title="新增家居" v-model="dialogVisible" width="30%">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="家居名" prop="name">
          <el-input v-model="form.name" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="厂商" prop="maker">
          <el-input v-model="form.maker" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="销量" prop="sales">
          <el-input v-model="form.sales" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <div style="margin: 10px auto; width: fit-content;">
      <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[2, 5,10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      // 增加分页相关的数据
      currentPage: 1,
      pageSize: 5,
      total: 10,
      search: '',
      dialogVisible: false,
      form: {},
      tableData: [],

      // 添加表单的校验规则
      rules: {
        name: [
          // 可以写多个针对name的校验规则
          {required: true, message: "name不能为空~", trigger: "blur"}
        ],
        maker: [
          {required: true, message: "maker不能为空~", trigger: "blur"}
        ],
        price: [
          {required: true, message: "price不能为空~", trigger: "blur"},
          // 使用正则表达式
          {pattern: /^([1-9]\d*|0)(\.\d+)?$/, message: "请输入数字", trigger: "blur"}
        ],
        sales: [
          {required: true, message: "sales不能为空~", trigger: "blur"},
          // 使用正则表达式
          {pattern: /^([1-9]\d*|0)$/, message: "请输入整数", trigger: "blur"}
        ],
        stock: [
          {required: true, message: "stock不能为空~", trigger: "blur"},
          // 使用正则表达式
          {pattern: /^([1-9]\d*|0)$/, message: "请输入整数", trigger: "blur"}
        ]
      }
    }
  },
  // 生命周期函数，在页面初始化时就调用list方法
  created() {
    this.list()
  },
  methods: {
    add() {
      // 显示对话框
      this.dialogVisible = true;
      // 重置表单
      this.form = {};
      // 清空上次检验的信息
      // this.$refs["form"].resetFields();
    },
    save() {
      // 修改表单和添加表单使用的是同一个方法，所以要进行区分，可以根据表单中是否有内容来区分，添加表单没内容，修改表单有内容
      if (this.form.id) {
        // 有值表示的就是修改
        request.put("/api/ssm/update", this.form).then(res => {
          if (res.code === 200) {
            // 修改成功，提示一个成功的消息框
            this.$message({
              type: "success",
              message: "更新成功"
            })
          } else {
            // 修改失败
            this.$message({
              type: "error",
              message: "更新失败，请重试"
            })
          }
        })

        this.dialogVisible = false;
        this.list(); // 再添加数据之后调用这个方法刷新界面
      } else {

        // 增加表单验证是否通过逻辑, valid就是表单校验后返回的结果
        this.$refs["form"].validate((valid) => {
          if (valid) {
            // 没值表示的就是添加

            // "http://localhost:8080/ssm/save" 表示请求的地址
            // this.form表示发送的数据
            request.post("/api/ssm/save", this.form).then(res => {
              this.dialogVisible = false;
              this.list(); // 再添加数据之后调用这个方法刷新界面
            })

          } else {
            this.$message({
              type: "error",
              message: "检验失败，不能提交表单~"
            })
          }
          return false;
        })
      }
    },
    // 编写list方法，请求放回所有信息, 自动触发，使用vue的生命周期
    list() {
      // request.post("/api/ssm/furns").then(res => {
      //   // 注意这里json对象的格式
      //   this.tableData = res.map.furnList;
      // })

      // 请求分页的方法
      request.get("/api/ssm/furnsByConditionPage", {
        params: {
          // 指定请求的参数
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res => {
        // 处理返回的分页信息
        this.tableData = res.map.pageInfo.list;
        this.total = res.map.pageInfo.total;
      })
    },
    handleEdit(row) {
      // 回显到对话框，将当前信息绑定到对话框
      this.dialogVisible = true;
      this.form = row;
    },
    handleDel(id) {
      request.delete("/api/ssm/del/" + id).then(res => {
        if (res.code === 200) {
          // 修改成功，提示一个成功的消息框
          this.$message({
            type: "success",
            message: "删除成功"
          })
        } else {
          // 修改失败
          this.$message({
            type: "error",
            message: "删除失败，请重试"
          })
        }
        this.dialogVisible = false;
        this.list();
      })
    },
    handleCurrentChange(pageNum) {
      this.currentPage = pageNum;
      // 发出分页请求
      this.list()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.list()
    }
  }
}
</script>
