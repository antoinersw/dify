import { useState } from 'react'
import ActionButton, { ActionButtonState } from '@/app/components/base/action-button'
import InputsFormContent from '@/app/components/base/chat/chat-with-history/inputs-form/content'
import { PortalToFollowElem, PortalToFollowElemContent, PortalToFollowElemTrigger } from '@/app/components/base/portal-to-follow-elem'

const ViewFormDropdown = () => {
  const [open, setOpen] = useState(false)

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement="bottom-end"
      offset={{
        mainAxis: 4,
        crossAxis: 4,
      }}
    >
      <PortalToFollowElemTrigger
        onClick={() => setOpen(v => !v)}
      >
        <ActionButton size="l" state={open ? ActionButtonState.Hover : ActionButtonState.Default}>
          <div className="i-ri-chat-settings-line h-[18px] w-[18px]" />
        </ActionButton>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className="z-50">
        <div className="max-h-[min(560px,70vh)] w-[400px] overflow-y-auto rounded-2xl border-[0.5px] border-components-panel-border bg-components-panel-bg p-4 shadow-lg backdrop-blur-sm">
          <InputsFormContent />
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>

  )
}

export default ViewFormDropdown
