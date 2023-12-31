import { MONTHS } from '@app/config/constants';
import { FilterIcon } from '@components/icons/FilterIcon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { formatCurrency } from '@app/utils/formatCurrency';
import { CategoryIcon } from '@components/icons/categories/CategoryIcon';
import { cn } from '@app/utils/cn';
import { Spinner } from '@components/Spinner';
import emptyStateImage from '@assets/empty-state.svg';
import { formatDate } from '@app/utils/formatDate';
import { SliderOption } from './SliderOption';
import { SliderNavigation } from './SliderNavigation';
import { useTransactionsController } from './useTransactionsController';
import { TransactionTypeDropdown } from './TransactionTypeDropdown';
import { FiltersModal } from './FiltersModal';
import { EditTransactionModal } from '../../modals/EditTransactionModal';

export function Transactions() {
  const {
    areValuesVisible,
    isInitialLoading,
    transactions,
    isLoading,
    isFilterModallOpen,
    handleOpenFilterModal,
    handleCloseFilterModal,
    handleChangeFilters,
    filters,
    handleApplyFilters,
    handleCloseEditModal,
    handleOpenEditModal,
    isEditModalOpen,
    transactionBeingEdited,
  } = useTransactionsController();

  const hasTransactions = transactions.length > 0;

  return (
    <div className="bg-gray-100 rounded-2xl w-full h-full px-4 py-8 md:p-10 flex flex-col">
      {isInitialLoading && (
      <div className='w-full h-full flex items-center justify-center'>
        <Spinner className='w-10 h-10' />
      </div>
      )}
      {!isInitialLoading && (
        <>
          <FiltersModal
            open={isFilterModallOpen}
            onClose={handleCloseFilterModal}
            onApplyFilters={handleApplyFilters}
          />
          <header className="">
            <div className='flex items-center justify-between'>
              <TransactionTypeDropdown
                onSelect={handleChangeFilters('type')}
                selectedType={filters.type}
              />
              <button onClick={handleOpenFilterModal}>
                <FilterIcon />
              </button>
            </div>

            <div className='mt-6 relative'>
              <Swiper
                slidesPerView={3}
                centeredSlides
                onSlideChange={(swiper) => handleChangeFilters('month')(swiper.realIndex)}
                initialSlide={filters.month}
              >
                <SliderNavigation />
                {MONTHS.map((month, index) => (
                  <SwiperSlide key={month}>
                    {({ isActive }) => (
                      <SliderOption isActive={isActive} month={month} index={index} />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </header>

          <div className="mt-4 space-y-2 flex-1 overflow-y-auto">
            {isLoading && (
              <div className='flex flex-col items-center justify-center h-full'>
                <Spinner className='w-10 h-10' />
              </div>
            )}

            {(!hasTransactions && !isLoading) && (
              <div className='flex flex-col items-center justify-center h-full'>
                <img src={emptyStateImage} alt="Sem transações" />
                <p className='text-gray-700'>Não encontramos nenhum transação</p>
              </div>
            )}
            {(hasTransactions && !isLoading) && (
              <>
                {transactionBeingEdited && (
                  <EditTransactionModal
                    open={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    transaction={transactionBeingEdited}
                  />
                )}

                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className='bg-white p-4 rounded-2xl flex items-center justify-between gap-4'
                    role='button'
                    onClick={() => handleOpenEditModal(transaction)}
                  >
                    <div className='flex-1 flex items-center gap-3'>
                      <CategoryIcon
                        category={transaction.category?.icon}
                        type={transaction.type === 'EXPENSE' ? 'expense' : 'income'}
                      />
                      <div>
                        <strong className='font-bold tracking-[-0.5px] block'>{transaction.name}</strong>
                        <span className='text-sm text-gray-600'>{formatDate(new Date(transaction.date))}</span>
                      </div>
                    </div>
                    <span className={cn(
                      'tracking-[-0.5px] font-medium',
                      transaction.type === 'EXPENSE' ? 'text-red-800' : 'text-green-800',
                      !areValuesVisible && 'blur-sm',
                    )}
                    >
                      {transaction.type === 'EXPENSE' ? '-' : '+'}
                      {formatCurrency(transaction.value)}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
