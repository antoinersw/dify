import type { ConversationItem } from '@/models/share'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ActionButton from '@/app/components/base/action-button'
import InputsFormContent from '@/app/components/base/chat/chat-with-history/inputs-form/content'
import RenameModal from '@/app/components/base/chat/chat-with-history/sidebar/rename-modal'
import Confirm from '@/app/components/base/confirm'
import { useChatWithHistoryContext } from './context'
import MobileOperationDropdown from './header/mobile-operation-dropdown'
import Operation from './header/operation'
import Sidebar from './sidebar'

const HeaderInMobile = () => {
  const {
    currentConversationId,
    currentConversationItem,
    pinnedConversationList,
    handleNewConversation,
    handlePinConversation,
    handleUnpinConversation,
    handleDeleteConversation,
    handleRenameConversation,
    conversationRenaming,
    inputsForms,
  } = useChatWithHistoryContext()
  const { t } = useTranslation()
  const isPin = pinnedConversationList.some(item => item.id === currentConversationId)
  const [showConfirm, setShowConfirm] = useState<ConversationItem | null>(null)
  const [showRename, setShowRename] = useState<ConversationItem | null>(null)
  const handleOperate = useCallback((type: string) => {
    if (type === 'pin')
      handlePinConversation(currentConversationId)

    if (type === 'unpin')
      handleUnpinConversation(currentConversationId)

    if (type === 'delete')
      setShowConfirm(currentConversationItem as any)

    if (type === 'rename')
      setShowRename(currentConversationItem as any)
  }, [currentConversationId, currentConversationItem, handlePinConversation, handleUnpinConversation])
  const handleCancelConfirm = useCallback(() => {
    setShowConfirm(null)
  }, [])
  const handleDelete = useCallback(() => {
    /* v8 ignore next 2 -- @preserve */
    if (showConfirm)
      handleDeleteConversation(showConfirm.id, { onSuccess: handleCancelConfirm })
  }, [showConfirm, handleDeleteConversation, handleCancelConfirm])
  const handleCancelRename = useCallback(() => {
    setShowRename(null)
  }, [])
  const handleRename = useCallback((newName: string) => {
    /* v8 ignore next 2 -- @preserve */
    if (showRename)
      handleRenameConversation(showRename.id, newName, { onSuccess: handleCancelRename })
  }, [showRename, handleRenameConversation, handleCancelRename])
  const [showSidebar, setShowSidebar] = useState(false)
  const [showChatSettings, setShowChatSettings] = useState(false)

  return (
    <>
      <div className="flex shrink-0 items-center gap-1 bg-mask-top2bottom-gray-50-to-transparent px-2 py-3">
        <ActionButton size="l" className="shrink-0" onClick={() => setShowSidebar(true)}>
          <div className="i-ri-menu-line h-[18px] w-[18px]" />
        </ActionButton>
        <div className="flex grow items-center justify-center">

          {currentConversationId && (
            <Operation
              title={currentConversationItem?.name || ''}
              isPinned={!!isPin}
              togglePin={() => handleOperate(isPin ? 'unpin' : 'pin')}
              isShowDelete
              isShowRenameConversation
              onRenameConversation={() => handleOperate('rename')}
              onDelete={() => handleOperate('delete')}
            />
          )}
        </div>
        <MobileOperationDropdown
          handleResetChat={handleNewConversation}
          handleViewChatSettings={() => setShowChatSettings(true)}
          hideViewChatSettings={inputsForms.length < 1}
        />
      </div>
      {showSidebar && (
        <div
          className="fixed inset-0 z-50 flex bg-background-overlay p-1"
          onClick={() => setShowSidebar(false)}
          data-testid="mobile-sidebar-overlay"
        >
          <div className="flex h-full w-[calc(100vw_-_40px)] rounded-xl bg-components-panel-bg shadow-lg backdrop-blur-sm" onClick={e => e.stopPropagation()} data-testid="sidebar-content">
            <Sidebar />
          </div>
        </div>
      )}
      {showChatSettings && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-background-overlay p-1"
          onClick={() => setShowChatSettings(false)}
          data-testid="mobile-chat-settings-overlay"
        >
          <div className="flex h-full w-[calc(100vw_-_40px)] flex-col overflow-y-auto rounded-xl bg-components-panel-bg p-4 shadow-lg backdrop-blur-sm" onClick={e => e.stopPropagation()}>
            <InputsFormContent />
          </div>
        </div>
      )}
      {!!showConfirm && (
        <Confirm
          title={t('chat.deleteConversation.title', { ns: 'share' })}
          content={t('chat.deleteConversation.content', { ns: 'share' }) || ''}
          isShow
          onCancel={handleCancelConfirm}
          onConfirm={handleDelete}
        />
      )}
      {showRename && (
        <RenameModal
          isShow
          onClose={handleCancelRename}
          saveLoading={conversationRenaming}
          name={showRename?.name || ''}
          onSave={handleRename}
        />
      )}
    </>
  )
}

export default HeaderInMobile
