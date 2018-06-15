var ConstantManage = {
  getRateType: { "1": "融资利率", "2": "贴现利率" },
  getAuthType: { "1": "签发额度", "2": "融资额度" },
  getOnFlag: { "1": "已启用", "2": "已停用" },
  getEntType: { "1": "成员企业", "2": "核心企业", "3": "供应商", "4": "保理商" },
  getRoleType: { "1": "经办员", "2": "复核员", "3": "管理员" },
  getAuthStatus: { "0": "已授权", "1": "待授权", "2": "已取消授权", "3": "已作废" },
  getRateStatus: { "4": "正常", "5": "关闭" },
  getRateChangeStatus: { "1": "待审核", "2": "审核通过", "3": "审核驳回", "4": "正常", "5": "关闭" },
  getLimitStatus: { "00": "正常", "01": "已失效", "02": "未生效", "03": "已冻结", "04": "待审核" },
  getLimitChangeStatus: { "01": "已失效", "10": "新增-待复核员审核", "11": "修改-待复核员审核", "12": "新增-待确认", "13": "修改-待确认", "14": "复核员已驳回", "15": "企业已驳回", "16": "企业已通过" },
  // getLimitType: {"1":"开单额度", "2":"单保额度", "3":"融资额度", "4":"贴现额度", "11":"信用额度", "21":"应收额度", "31":"质押额度"},
  getLimitType: { "1": "签发额度", "3": "融资额度" },
  getConfirmFlag: { "1": "是", "2": "否" },
  getDefaultAcc: { "1": "默认银行帐户", "2": "否" },
  getDelayFlag: { "1": "是", "2": "否" },
  getIdentityType: { "1": "身份证", "2": "护照", "3": "港澳居民往来内地通行证", "4": "台湾居民来往大陆通行证" },
  getEntStatus: { "00": "正常", "01": "冻结", "10": "待企业基本信息", "11": "待企业用户信息", "12": "待资料提交", "13": "待打款认证", "14": "待认证初审", "15": "待认证复审", "16": "待证书申请", "17": "待授权书签署" },
  getCertStatus: { "1": "新申请", "2": "申请中", "3": "超时", "4": "申请失败", "5": "成功", "6": "待申请" },
  getProtocolStatus: { "10": "待上传合同", "11": "待转换合同", "12": "待创建合同", "13": "待申请人签署", "14": "待接收人签署", "15": "待锁定并结束合同", "16": "签约成功", "17": "签约失败" },
  getXdOpenType: { "1": "额度签发" },
  getXdStatus: {
    "10": "签发待复核", "11": "签发待审批", "12": "签发待签收", "13": "已签发", "14": "签收已驳回",
    "00": "正常持有", "01": "转让中", "02": "融资中", "03": "贴现中",
    "20": "整转待复核", "21": "整转待签收", "22": "拆转待复核", "23": "拆转待签收", "24": "已转让", "29": "转让已撤销",
    "30": "整融待复核", "31": "整融待初审", "32": "整融待复审", "33": "拆融待复核", "34": "拆融待初审", "35": "拆融待复审", "36": "已融资", "39": "融资已撤销",
    "50": "整贴待复核", "51": "整贴待初审", "52": "整贴待复审", "53": "拆贴待复核", "54": "拆贴待初审", "55": "拆贴待复审", "56": "已提前到期", "59": "贴现已撤销",
    "97": "已转票", "98": "已到期", "99": "已作废"
  },
  getPayBusType: { "00": "融资付款", "01": "动态兑付付款", "10": "润信到期付款", "11": "延期利息付款" },
  getEntAccountStatus: { "00": "正常", "01": "已删除", "10": "新增待审核", "11": "新增已驳回" },
  getUploadStatus: { "0": "通过", "1": "未上传", "2": "已上传", "3": "需重新上传" },
  getAccType: { "1": "一般结算户" },
  getPayeeStatus: { "00": "收款成功", "01": "待收款", "02": "支付中", "03": "支付失败", "04": "拒绝支付", "05": "无需支付", "06": "支付失败", "07": "收款待确认" },
  getPayerStatus: { "00": "付款成功", "01": "待付款", "02": "支付中", "03": "支付失败", "04": "拒绝支付", "05": "无需支付", "06": "支付失败", "07": "付款待确认" },
  getEntArchiveType: { "11": "营业执照或统一社会信用代码资料", "12": "身份证资料", "13": "银行账户资料", "14": "授权委托书资料" },
  getProtocolType: { "10": "注册认证", "11": "授权委托", "12": "开单", "13": "转单", "14": "融单", "15": "提前兑付", "16": "入驻协议", "17": "延期协议", "18": "自动签收协议" },
  getIdType: { "1": "身份证", "2": "护照", "3": "港澳居民往来内地通行证", "4": "台湾居民来往大陆通行证" },
  getTransStatus: { "20": "整转待复核", "21": "整转待签收", "22": "拆转待复核", "23": "拆转待签收", "24": "单已转让", "99": "润信已作废" },
  getLockedStatus: { "1": "锁定", "0": "正常" },
  getLimitOperateType: { "4000": "额度新增", "4001": "额度调增", "4002": "额度调减", "4003": "额度冻结", "4004": "额度解冻", "4005": "额度占用", "4006": "额度释放" }
}

var constantTranslation = {
  getEntType: function (entType) {
    return ConstantManage.getEntType[entType];
  },
  getRoleType: function (roleType) {
    return ConstantManage.getRoleType[roleType];
  },
  getRateType: function (rateType) {
    return ConstantManage.getRateType[rateType];
  },
  getAuthStatus: function (authStatus) {
    return ConstantManage.getAuthStatus[authStatus];
  },
  getOnFlag: function (onFlag) {
    return ConstantManage.getOnFlag[onFlag];
  },
  getAuthType: function (authType) {
    return ConstantManage.getAuthType[authType];
  },
  getRateStatus: function (rateStatus) {
    return ConstantManage.getRateStatus[rateStatus];
  },
  getLimitStatus: function (limitStatus) {
    return ConstantManage.getLimitStatus[limitStatus];
  },
  getLimitChangeStatus: function (limitStatus) {
    return ConstantManage.getLimitChangeStatus[limitStatus];
  },
  getLimitType: function (limitType) {
    return ConstantManage.getLimitType[limitType];
  },
  getConfirmFlag: function (confirmFlag) {
    return ConstantManage.getConfirmFlag[confirmFlag];
  },
  getDefaultAcc: function (defaultAcc) {
    return ConstantManage.getDefaultAcc[defaultAcc];
  },
  getDelayFlag: function (delayFlag) {
    return ConstantManage.getDelayFlag[delayFlag];
  },
  getIdentityType: function (idType) {
    return ConstantManage.getIdentityType[idType];
  },
  getEntStatus: function (entStatus) {
    return ConstantManage.getEntStatus[entStatus];
  },
  getCertStatus: function (certStatus) {
    return ConstantManage.getCertStatus[certStatus];
  },
  getProtocolStatus: function (protocolStatus) {
    return ConstantManage.getProtocolStatus[protocolStatus];
  },
  getXdOpenType: function (openType) {
    return ConstantManage.getXdOpenType[openType];
  },
  getXdStatus: function (xdStatus) {
    return ConstantManage.getXdStatus[xdStatus];
  },
  getRateChangeStatus: function (rateStatus) {
    return ConstantManage.getRateChangeStatus[rateStatus];
  },
  getEntAccountStatus: function (entAccountStatus) {
    return ConstantManage.getEntAccountStatus[entAccountStatus];
  },
  getUploadStatus: function (uploadStatus) {
    return ConstantManage.getUploadStatus[uploadStatus];
  },
  getAccType: function (accType) {
    return ConstantManage.getAccType[accType];
  },
  getIdType: function (idType) {
    return ConstantManage.getIdType[idType];
  },
  getPayBusType: function (busType) {
    return ConstantManage.getPayBusType[busType];
  },
  getPayeeStatus: function (payStatus) {
    return ConstantManage.getPayeeStatus[payStatus];
  },
  getPayerStatus: function (payStatus) {
    return ConstantManage.getPayerStatus[payStatus];
  },
  getEntArchiveType: function (archiveType) {
    return ConstantManage.getEntArchiveType[archiveType];
  },
  getProtocolType: function (protocolType) {
    return ConstantManage.getProtocolType[protocolType];
  },
  getTransStatus: function (transStatus) {
    return ConstantManage.getTransStatus[transStatus];
  },
  getLockedStatus: function (locked) {
    return ConstantManage.getLockedStatus[locked];
  },
  getLimitOperateType: function (operType) {
    return ConstantManage.getLimitOperateType[operType];
  }
}

module.exports = {
  constantTranslation: constantTranslation
}