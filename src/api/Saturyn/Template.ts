import { SaturynParams } from './Parameters'
import { PortalUseragent } from 'src/api'

export const SaturynTemplate = ( ): SaturynParams =>
{
    return {
        id:         '',
        title:      '',
        icon:       '',
        url:        '',
        hasRibbon:  true,
        dock:       'right',
        profileKey: 'saturyn',
        zoom:       1.0,
        userAgent:  PortalUseragent
    }
}
