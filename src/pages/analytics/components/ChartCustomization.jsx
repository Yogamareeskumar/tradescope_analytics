import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ChartCustomization = ({ chartConfig, onConfigChange, onExport }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const colorSchemeOptions = [
    { value: 'default', label: 'Default Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'light', label: 'Light Theme' },
    { value: 'colorful', label: 'Colorful' },
    { value: 'monochrome', label: 'Monochrome' },
    { value: 'professional', label: 'Professional' }
  ];

  const dataDensityOptions = [
    { value: 'low', label: 'Low Density' },
    { value: 'medium', label: 'Medium Density' },
    { value: 'high', label: 'High Density' },
    { value: 'auto', label: 'Auto Adjust' }
  ];

  const exportFormatOptions = [
    { value: 'png', label: 'PNG Image' },
    { value: 'jpg', label: 'JPEG Image' },
    { value: 'svg', label: 'SVG Vector' },
    { value: 'pdf', label: 'PDF Document' }
  ];

  const handleConfigChange = (key, value) => {
    onConfigChange({
      ...chartConfig,
      [key]: value
    });
  };

  const handleExportChart = (format) => {
    onExport(format);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Settings" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Chart Customization</h3>
        </div>
        
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      {isExpanded && (
        <div className="space-y-6">
          {/* Visual Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Visual Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Color Scheme"
                options={colorSchemeOptions}
                value={chartConfig?.colorScheme || 'default'}
                onChange={(value) => handleConfigChange('colorScheme', value)}
              />
              
              <Select
                label="Data Density"
                options={dataDensityOptions}
                value={chartConfig?.dataDensity || 'medium'}
                onChange={(value) => handleConfigChange('dataDensity', value)}
              />
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Display Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Checkbox
                label="Show Grid Lines"
                checked={chartConfig?.showGrid || true}
                onChange={(e) => handleConfigChange('showGrid', e?.target?.checked)}
              />
              
              <Checkbox
                label="Show Data Labels"
                checked={chartConfig?.showLabels || false}
                onChange={(e) => handleConfigChange('showLabels', e?.target?.checked)}
              />
              
              <Checkbox
                label="Show Tooltips"
                checked={chartConfig?.showTooltips || true}
                onChange={(e) => handleConfigChange('showTooltips', e?.target?.checked)}
              />
              
              <Checkbox
                label="Show Legend"
                checked={chartConfig?.showLegend || true}
                onChange={(e) => handleConfigChange('showLegend', e?.target?.checked)}
              />
              
              <Checkbox
                label="Animate Transitions"
                checked={chartConfig?.animate || true}
                onChange={(e) => handleConfigChange('animate', e?.target?.checked)}
              />
              
              <Checkbox
                label="Responsive Layout"
                checked={chartConfig?.responsive || true}
                onChange={(e) => handleConfigChange('responsive', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Chart-Specific Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Chart-Specific Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Checkbox
                label="Show Trend Lines"
                checked={chartConfig?.showTrendLines || false}
                onChange={(e) => handleConfigChange('showTrendLines', e?.target?.checked)}
              />
              
              <Checkbox
                label="Show Moving Averages"
                checked={chartConfig?.showMovingAverages || false}
                onChange={(e) => handleConfigChange('showMovingAverages', e?.target?.checked)}
              />
              
              <Checkbox
                label="Show Volume Bars"
                checked={chartConfig?.showVolume || false}
                onChange={(e) => handleConfigChange('showVolume', e?.target?.checked)}
              />
              
              <Checkbox
                label="Show Benchmark"
                checked={chartConfig?.showBenchmark || false}
                onChange={(e) => handleConfigChange('showBenchmark', e?.target?.checked)}
              />
              
              <Checkbox
                label="Logarithmic Scale"
                checked={chartConfig?.logScale || false}
                onChange={(e) => handleConfigChange('logScale', e?.target?.checked)}
              />
              
              <Checkbox
                label="Zero Baseline"
                checked={chartConfig?.zeroBaseline || true}
                onChange={(e) => handleConfigChange('zeroBaseline', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Export Options</h4>
            <div className="flex flex-wrap gap-3">
              {exportFormatOptions?.map((format) => (
                <Button
                  key={format?.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportChart(format?.value)}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export as {format?.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Preset Configurations */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Quick Presets</h4>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConfigChange({
                  colorScheme: 'professional',
                  dataDensity: 'medium',
                  showGrid: true,
                  showLabels: false,
                  showTooltips: true,
                  showLegend: true,
                  animate: false,
                  showTrendLines: true,
                  showBenchmark: true
                })}
              >
                Professional
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConfigChange({
                  colorScheme: 'colorful',
                  dataDensity: 'high',
                  showGrid: true,
                  showLabels: true,
                  showTooltips: true,
                  showLegend: true,
                  animate: true,
                  showTrendLines: false,
                  showBenchmark: false
                })}
              >
                Detailed View
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConfigChange({
                  colorScheme: 'monochrome',
                  dataDensity: 'low',
                  showGrid: false,
                  showLabels: false,
                  showTooltips: true,
                  showLegend: false,
                  animate: false,
                  showTrendLines: false,
                  showBenchmark: false
                })}
              >
                Minimal
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConfigChange({
                  colorScheme: 'default',
                  dataDensity: 'medium',
                  showGrid: true,
                  showLabels: false,
                  showTooltips: true,
                  showLegend: true,
                  animate: true,
                  showTrendLines: false,
                  showBenchmark: false
                })}
              >
                Reset to Default
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <Button
              variant="default"
              onClick={() => console.log('Apply customization:', chartConfig)}
              iconName="Check"
              iconPosition="left"
            >
              Apply Changes
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => console.log('Save as template')}
              iconName="Save"
              iconPosition="left"
            >
              Save as Template
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartCustomization;