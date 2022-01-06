const REGEX = {
  URL: /^(http(s?):\/\/)?(www\.)?[a-zA-Z0-9\.\-\_]+(\.[a-zA-Z]{2,15})+(\:[0-9]{2,5})?(\/[a-zA-Z0-9\_\-\s\.\/\?\%\#\&\=;]*)?$/ // eslint-disable-line
}

const PROJECT_STATUS = {
  DRAFT: 'draft',
  IN_REVIEW: 'in_review',
  REVIEWED: 'reviewed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled'
}

const RESOURCES = {
  PROJECT: 'project',
  PROJECT_TEMPLATE: 'project.template',
  PROJECT_TYPE: 'project.type',
  PROJECT_MEMBER: 'project.member',
  PROJECT_MEMBER_INVITE: 'project.member.invite',
  ORG_CONFIG: 'project.orgConfig',
  FORM_VERSION: 'project.form.version',
  FORM_REVISION: 'project.form.revision',
  PRICE_CONFIG_VERSION: 'project.priceConfig.version',
  PRICE_CONFIG_REVISION: 'project.priceConfig.revision',
  PLAN_CONFIG_VERSION: 'project.planConfig.version',
  PLAN_CONFIG_REVISION: 'project.planConfig.revision',
  PRODUCT_TEMPLATE: 'product.template',
  PRODUCT_CATEGORY: 'product.category',
  PHASE: 'project.phase',
  PHASE_PRODUCT: 'project.phase.product',
  TIMELINE: 'timeline',
  MILESTONE: 'milestone',
  MILESTONE_TEMPLATE: 'milestone.template',
  CUSTOMER_PAYMENT: 'customer-payment',
  ATTACHMENT: 'attachment'
}

const TIMELINE_REFERENCES = {
  PROJECT: 'project',
  PHASE: 'phase',
  PRODUCT: 'product'
}

const INVITE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REFUSED: 'refused',
  REQUESTED: 'requested',
  REQUEST_REJECTED: 'request_rejected',
  REQUEST_APPROVED: 'request_approved',
  CANCELED: 'canceled'
}

const PROJECT_MEMBER_ROLE = {
  MANAGER: 'manager',
  OBSERVER: 'observer',
  CUSTOMER: 'customer',
  COPILOT: 'copilot',
  ACCOUNT_MANAGER: 'account_manager',
  PROGRAM_MANAGER: 'program_manager',
  ACCOUNT_EXECUTIVE: 'account_executive',
  SOLUTION_ARCHITECT: 'solution_architect',
  PROJECT_MANAGER: 'project_manager'
}

const MILESTONE_TEMPLATE_REFERENCES = {
  PRODUCT_TEMPLATE: 'productTemplate'
}

const ATTACHMENT_TYPES = {
  'FILE': 'file',
  'LINK': 'link'
}

const CUSTOMER_PAYMENT_STATUS = {
  CANCELED: 'canceled',
  PROCESSING: 'processing',
  REQUIRES_ACTION: 'requires_action',
  REQUIRES_CAPTURE: 'requires_capture',
  REQUIRES_CONFIRMATION: 'requires_confirmation',
  REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
  SUCCEEDED: 'succeeded',
  REFUNDED: 'refunded',
  REFUND_FAILED: 'refund_failed',
  REFUND_PENDING: 'refund_pending'
}

module.exports = {
  RESOURCES,
  REGEX,
  PROJECT_STATUS,
  TIMELINE_REFERENCES,
  INVITE_STATUS,
  PROJECT_MEMBER_ROLE,
  MILESTONE_TEMPLATE_REFERENCES,
  CUSTOMER_PAYMENT_STATUS,
  ATTACHMENT_TYPES
}
