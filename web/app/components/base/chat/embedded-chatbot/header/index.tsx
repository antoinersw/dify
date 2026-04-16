import type { FC } from 'react'
import type { Theme } from '../theme/theme-context'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ActionButton from '@/app/components/base/action-button'
import ViewFormDropdown from '@/app/components/base/chat/embedded-chatbot/inputs-form/view-form-dropdown'
import Tooltip from '@/app/components/base/tooltip'
import { cn } from '@/utils/classnames'
import { isClient } from '@/utils/client'
import {
  useEmbeddedChatbotContext,
} from '../context'
import { CssTransform } from '../theme/utils'

/** Shown in embedded chatbot header (mobile + desktop). */
const EMBEDDED_CHAT_HEADER_LABEL = 'Prise de rendez-vous - Contact Rapide'

export type IHeaderProps = {
  isMobile?: boolean
  allowResetChat?: boolean
  customerIcon?: React.ReactNode
  title: string
  theme?: Theme
  onCreateNewChat?: () => void
}
const Header: FC<IHeaderProps> = ({
  isMobile,
  allowResetChat,
  customerIcon,
  title: _siteTitleHidden,
  theme,
  onCreateNewChat,
}) => {
  const { t } = useTranslation()
  const {
    currentConversationId,
    inputsForms,
    allInputsHidden,
  } = useEmbeddedChatbotContext()

  const isIframe = isClient ? window.self !== window.top : false
  const [parentOrigin, setParentOrigin] = useState('')
  const [showToggleExpandButton, setShowToggleExpandButton] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleMessageReceived = useCallback((event: MessageEvent) => {
    let currentParentOrigin = parentOrigin
    if (!currentParentOrigin && event.data.type === 'dify-chatbot-config') {
      currentParentOrigin = event.origin
      setParentOrigin(event.origin)
    }
    if (event.origin !== currentParentOrigin)
      return
    if (event.data.type === 'dify-chatbot-config')
      setShowToggleExpandButton(event.data.payload.isToggledByButton && !event.data.payload.isDraggable)
  }, [parentOrigin])

  useEffect(() => {
    if (!isIframe)
      return

    const listener = (event: MessageEvent) => handleMessageReceived(event)
    window.addEventListener('message', listener)

    // Security: Use document.referrer to get parent origin
    const targetOrigin = document.referrer ? new URL(document.referrer).origin : '*'
    window.parent.postMessage({ type: 'dify-chatbot-iframe-ready' }, targetOrigin)

    return () => window.removeEventListener('message', listener)
  }, [isIframe, handleMessageReceived])

  const handleToggleExpand = useCallback(() => {
    if (!isIframe || !showToggleExpandButton)
      return
    setExpanded(!expanded)
    window.parent.postMessage({
      type: 'dify-chatbot-expand-change',
    }, parentOrigin)
  }, [isIframe, parentOrigin, showToggleExpandButton, expanded])

  const headerBarStyle = useMemo(
    () => Object.assign(
      {},
      CssTransform(theme?.backgroundHeaderColorStyle ?? ''),
      CssTransform(theme?.headerBorderBottomStyle ?? ''),
    ),
    [theme?.backgroundHeaderColorStyle, theme?.headerBorderBottomStyle],
  )

  if (!isMobile) {
    return (
      <div
        className={cn('flex h-14 shrink-0 items-center justify-between rounded-t-2xl px-3')}
        style={headerBarStyle}
      >
        <div className="flex min-w-0 grow items-center gap-3">
          {customerIcon}
          <div
            className="truncate system-md-semibold"
            style={CssTransform(theme?.colorFontOnHeaderStyle ?? '')}
          >
            {EMBEDDED_CHAT_HEADER_LABEL}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {
            showToggleExpandButton && (
              <Tooltip
                popupContent={expanded ? t('chat.collapse', { ns: 'share' }) : t('chat.expand', { ns: 'share' })}
              >
                <ActionButton size="l" onClick={handleToggleExpand} data-testid="expand-button">
                  {
                    expanded
                      ? <div className={cn('i-ri-collapse-diagonal-2-line h-[18px] w-[18px]', theme?.colorPathOnHeader)} />
                      : <div className={cn('i-ri-expand-diagonal-2-line h-[18px] w-[18px]', theme?.colorPathOnHeader)} />
                  }
                </ActionButton>
              </Tooltip>
            )
          }
          {currentConversationId && allowResetChat && (
            <Tooltip
              popupContent={t('chat.resetChat', { ns: 'share' })}
            >
              <ActionButton size="l" onClick={onCreateNewChat} data-testid="reset-chat-button">
                <div className={cn('i-ri-reset-left-line h-[18px] w-[18px]', theme?.colorPathOnHeader)} />
              </ActionButton>
            </Tooltip>
          )}
          {currentConversationId && inputsForms.length > 0 && !allInputsHidden && (
            <ViewFormDropdown iconColor={theme?.colorPathOnHeader} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('flex h-14 shrink-0 items-center justify-between rounded-t-2xl px-3')}
      style={headerBarStyle}
    >
      <div className="flex min-w-0 grow items-center gap-3">
        {customerIcon}
        <div
          className="truncate system-md-semibold"
          style={CssTransform(theme?.colorFontOnHeaderStyle ?? '')}
        >
          {EMBEDDED_CHAT_HEADER_LABEL}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {
          showToggleExpandButton && (
            <Tooltip
              popupContent={expanded ? t('chat.collapse', { ns: 'share' }) : t('chat.expand', { ns: 'share' })}
            >
              <ActionButton size="l" onClick={handleToggleExpand} data-testid="mobile-expand-button">
                {
                  expanded
                    ? <div className={cn('i-ri-collapse-diagonal-2-line h-[18px] w-[18px]', theme?.colorPathOnHeader)} />
                    : <div className={cn('i-ri-expand-diagonal-2-line h-[18px] w-[18px]', theme?.colorPathOnHeader)} />
                }
              </ActionButton>
            </Tooltip>
          )
        }
        {currentConversationId && allowResetChat && (
          <Tooltip
            popupContent={t('chat.resetChat', { ns: 'share' })}
          >
            <ActionButton size="l" onClick={onCreateNewChat} data-testid="mobile-reset-chat-button">
              <div className={cn('i-ri-reset-left-line h-[18px] w-[18px]', theme?.colorPathOnHeader)} />
            </ActionButton>
          </Tooltip>
        )}
        {currentConversationId && inputsForms.length > 0 && !allInputsHidden && (
          <ViewFormDropdown iconColor={theme?.colorPathOnHeader} />
        )}
      </div>
    </div>
  )
}

export default React.memo(Header)
