import * as React from 'react'
import { useState } from 'react'
import ActionButton, { ActionButtonState } from '@/app/components/base/action-button'
import InputsFormContent from '@/app/components/base/chat/embedded-chatbot/inputs-form/content'
import { PortalToFollowElem, PortalToFollowElemContent, PortalToFollowElemTrigger } from '@/app/components/base/portal-to-follow-elem'
import { cn } from '@/utils/classnames'

type Props = {
  iconColor?: string
}

const ViewFormDropdown = ({
  iconColor,
}: Props) => {
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
      <PortalToFollowElemTrigger onClick={() => setOpen(v => !v)}>
        <ActionButton
          size="l"
          state={open ? ActionButtonState.Hover : ActionButtonState.Default}
          data-testid="view-form-dropdown-trigger"
        >
          <div className={cn('i-ri-chat-settings-line h-[18px] w-[18px] shrink-0', iconColor)} />
        </ActionButton>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className="z-[99]">
        <div
          data-testid="view-form-dropdown-content"
          className="max-h-[min(560px,70vh)] w-[400px] overflow-y-auto rounded-2xl border-[0.5px] border-components-panel-border bg-components-panel-bg p-4 shadow-lg backdrop-blur-sm"
        >
          <InputsFormContent />
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

export default ViewFormDropdown
