import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedTrades, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'export', label: 'Export Selected' },
    { value: 'categorize', label: 'Add Category' },
    { value: 'tag', label: 'Add Strategy Tag' },
    { value: 'delete', label: 'Delete Selected' }
  ];

  const handleActionExecute = () => {
    if (!selectedAction || selectedTrades?.length === 0) return;
    
    onBulkAction(selectedAction, selectedTrades);
    setSelectedAction('');
  };

  const exportOptions = [
    { value: 'csv', label: 'Export as CSV' },
    { value: 'excel', label: 'Export as Excel' },
    { value: 'pdf', label: 'Export as PDF' }
  ];

  const handleQuickExport = (format) => {
    onBulkAction('export', selectedTrades, { format });
  };

  if (selectedTrades?.length === 0) {
    return null;
  }

  return (
    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-accent" />
            <span className="text-sm font-medium text-foreground">
              {selectedTrades?.length} trade{selectedTrades?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Quick Export Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:block">Quick export:</span>
            
            {exportOptions?.map((option) => (
              <Button
                key={option?.value}
                variant="outline"
                size="sm"
                onClick={() => handleQuickExport(option?.value)}
                iconName="Download"
                iconPosition="left"
              >
                {option?.value?.toUpperCase()}
              </Button>
            ))}
          </div>
          
          {/* Bulk Action Dropdown */}
          <div className="flex items-center space-x-2">
            <Select
              options={bulkActionOptions}
              value={selectedAction}
              onChange={setSelectedAction}
              className="min-w-48"
            />
            
            <Button
              variant="default"
              onClick={handleActionExecute}
              disabled={!selectedAction}
              iconName="Play"
              iconPosition="left"
            >
              Execute
            </Button>
          </div>
        </div>
      </div>
      {/* Action Preview */}
      {selectedAction && (
        <div className="mt-3 pt-3 border-t border-accent/20">
          <div className="text-sm text-muted-foreground">
            {selectedAction === 'export' && `Export ${selectedTrades?.length} trades to file`}
            {selectedAction === 'categorize' && `Add category to ${selectedTrades?.length} trades`}
            {selectedAction === 'tag' && `Add strategy tag to ${selectedTrades?.length} trades`}
            {selectedAction === 'delete' && (
              <span className="text-destructive font-medium">
                Permanently delete {selectedTrades?.length} trades (this cannot be undone)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActions;