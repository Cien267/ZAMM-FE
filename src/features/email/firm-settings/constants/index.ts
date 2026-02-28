export const firmEmailSettingKeys = {
  firmEmailSettings: () => ['firmEmailSettings'] as const,
  firmEmailSettingDetailByBrokerage: (brokerageId: string) =>
    [
      ...firmEmailSettingKeys.firmEmailSettings(),
      'detail',
      brokerageId,
    ] as const,
}
