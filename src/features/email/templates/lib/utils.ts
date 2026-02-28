import type { FirmEmailSetting } from '../../firm-settings/types'

export const renderFullPreview = (
  bodyHtml: string,
  firmSettings?: FirmEmailSetting
) => {
  const baseStyle = `
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
      img { max-width: 100%; height: auto; }
    </style>
  `

  return `
    <!DOCTYPE html>
    <html>
      <head>${baseStyle}</head>
      <body>
        <div id="header-preview">${firmSettings?.headerHtml || '<p style="color: #94a3b8; text-align: center;">[Your Header]</p>'}</div>
        
        <div style="margin: 20px 0">
          ${bodyHtml || '<i>Empty template content...</i>'}
        </div>

        <div id="footer-preview">${firmSettings?.footerHtml || '<p style="color: #94a3b8; text-align: center;">[Your Footer]</p>'}</div>
      </body>
    </html>
  `
}
