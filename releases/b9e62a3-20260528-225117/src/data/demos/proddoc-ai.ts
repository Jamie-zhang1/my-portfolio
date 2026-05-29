/* ============================================================
 * ProdDoc AI — 体验 Demo 数据
 * ----------------------------------------------------------
 * 修改默认表单值：编辑 defaultFormValues
 * 修改文档用途选项：编辑 docTypes
 * 修改产品类型选项：编辑 productTypes
 * 修改生成模板：编辑 generateDocument 函数
 * ============================================================ */

export const productTypes = ["B 端 SaaS 平台", "移动端应用", "后台管理系统"] as const;

export const docTypes = ["产品说明书", "操作手册", "售前演示材料"] as const;

export const defaultFormValues = {
  productName: "智能客户线索管理平台",
  productType: "B 端 SaaS 平台" as (typeof productTypes)[number],
  targetUsers: "客户经理与运营人员",
  coreModules: "线索筛选、客户画像、跟进记录、数据导出",
  docType: "产品说明书" as (typeof docTypes)[number],
};

export interface ProddocFormData {
  productName: string;
  productType: string;
  targetUsers: string;
  coreModules: string;
  docType: string;
}

/** 本地模板生成：根据表单数据生成结构化文档预览（不调用 AI） */
export function generateDocument(data: ProddocFormData): string {
  const modules = data.coreModules
    .split(/[、,，]/)
    .map((m) => m.trim())
    .filter(Boolean);

  const moduleDescriptions = modules
    .map((m) => `- **${m}**：支持该模块的独立操作与数据管理，可根据业务需要灵活配置。`)
    .join("\n");

  if (data.docType === "操作手册") {
    return `# ${data.productName} 操作手册

## 一、概述

${data.productName} 是一款面向${data.targetUsers}的${data.productType}，旨在通过数字化手段提升工作效率与协作体验。

本手册帮助用户快速掌握系统的核心操作方法。

## 二、核心模块

${moduleDescriptions}

## 三、典型操作流程

1. 登录系统，进入工作台首页；
2. 根据业务场景选择对应功能模块；
3. 按页面引导完成数据录入或查询操作；
4. 使用导出功能生成所需报表或文档。

## 四、常见问题

- **如何重置密码？** 在个人设置中选择"修改密码"。
- **数据如何导出？** 在目标模块列表页点击"导出"按钮，选择格式即可。

## 五、技术支持

如遇到使用问题，请联系产品管理员或查阅在线帮助中心。`;
  }

  if (data.docType === "售前演示材料") {
    return `# ${data.productName} 售前介绍

## 产品定位

${data.productName} 是一款专为${data.targetUsers}设计的${data.productType}，帮助企业实现业务流程数字化与智能化。

## 核心价值

- 提升工作效率，减少重复手工操作；
- 数据集中管理，支持实时分析与决策；
- 灵活配置，适配不同业务场景。

## 核心能力

${moduleDescriptions}

## 典型客户场景

适用于需要系统化管理业务流程、提升团队协作效率的中大型组织。

## 为什么选择我们

- 产品成熟，快速上线；
- 按需定制，灵活扩展；
- 专业团队，持续服务。`;
  }

  // 默认：产品说明书
  return `# ${data.productName} 产品说明书

## 一、产品概述

${data.productName} 是一款面向${data.targetUsers}的${data.productType}，旨在帮助团队高效完成日常工作流程，实现信息集中管理与业务协同。

## 二、目标用户

${data.targetUsers}

## 三、核心能力

${moduleDescriptions}

## 四、典型使用流程

1. 用户登录后进入工作台；
2. 根据角色权限访问对应功能模块；
3. 在各模块中完成数据录入、查询、分析等操作；
4. 通过导出功能输出所需文档或报表。

## 五、应用价值

- 标准化业务流程，降低沟通成本；
- 数据可视化，辅助管理决策；
- 支持多角色协作，提升团队效率。`;
}
