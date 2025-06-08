import { useMemo, useState } from 'react';
import {
  Package,
  Monitor,
  Headphones,
  Mouse,
  Keyboard,
  Smartphone,
  Laptop,
  Camera,
  Speaker,
  Gamepad2,
  Tablet,
  Watch,
  Tv,
  Radio,
  Cpu,
  HardDrive,
  MemoryStick,
  Wifi,
  Battery,
  Zap,
  Search,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const availableIcons = [
  { name: 'Package', icon: Package, keywords: ['box', 'product', 'general'] },
  {
    name: 'Monitor',
    icon: Monitor,
    keywords: ['screen', 'display', 'computer'],
  },
  {
    name: 'Headphones',
    icon: Headphones,
    keywords: ['audio', 'music', 'sound'],
  },
  { name: 'Mouse', icon: Mouse, keywords: ['computer', 'peripheral', 'click'] },
  {
    name: 'Keyboard',
    icon: Keyboard,
    keywords: ['computer', 'typing', 'input'],
  },
  {
    name: 'Smartphone',
    icon: Smartphone,
    keywords: ['phone', 'mobile', 'cell'],
  },
  {
    name: 'Laptop',
    icon: Laptop,
    keywords: ['computer', 'portable', 'notebook'],
  },
  {
    name: 'Camera',
    icon: Camera,
    keywords: ['photo', 'picture', 'photography'],
  },
  { name: 'Speaker', icon: Speaker, keywords: ['audio', 'sound', 'music'] },
  {
    name: 'Gamepad2',
    icon: Gamepad2,
    keywords: ['gaming', 'controller', 'games'],
  },
  { name: 'Tablet', icon: Tablet, keywords: ['ipad', 'touch', 'portable'] },
  { name: 'Watch', icon: Watch, keywords: ['smartwatch', 'wearable', 'time'] },
  { name: 'Tv', icon: Tv, keywords: ['television', 'screen', 'entertainment'] },
  { name: 'Radio', icon: Radio, keywords: ['music', 'broadcast', 'audio'] },
  { name: 'Cpu', icon: Cpu, keywords: ['processor', 'computer', 'chip'] },
  { name: 'HardDrive', icon: HardDrive, keywords: ['storage', 'disk', 'data'] },
  {
    name: 'MemoryStick',
    icon: MemoryStick,
    keywords: ['usb', 'storage', 'flash'],
  },
  { name: 'Wifi', icon: Wifi, keywords: ['wireless', 'internet', 'network'] },
  { name: 'Battery', icon: Battery, keywords: ['power', 'energy', 'charge'] },
  { name: 'Zap', icon: Zap, keywords: ['electric', 'power', 'energy'] },
];

interface IconPickerProps {
  value?: string;
  onSelect: (iconName: string) => void;
  className?: string;
}

export function IconPicker({ value, onSelect, className }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedIcon = availableIcons.find((icon) => icon.name === value);
  const SelectedIconComponent = selectedIcon?.icon || Package;

  const filteredIcons = availableIcons.filter(
    (icon) =>
      icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-start', className)}
        >
          <SelectedIconComponent className="mr-2 h-4 w-4" />
          {selectedIcon ? selectedIcon.name : 'Select icon...'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2 p-4 max-h-64 overflow-auto">
          {filteredIcons.map((iconItem) => {
            const IconComponent = iconItem.icon;
            const isSelected = value === iconItem.name;

            return (
              <Button
                key={iconItem.name}
                variant={isSelected ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'h-10 w-10 p-0 relative',
                  isSelected && 'ring-2 ring-primary'
                )}
                onClick={() => {
                  onSelect(iconItem.name);
                  setOpen(false);
                }}
                title={iconItem.name}
              >
                <IconComponent className="h-6 w-6" />
                {isSelected && (
                  <Check className="absolute -top-1 -right-1 h-3 w-3 bg-primary text-primary-foreground rounded-full p-0.5" />
                )}
              </Button>
            );
          })}
        </div>
        {filteredIcons.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No icons found
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function IconValue({ icon }: { icon: string }) {
  const foundIcon = useMemo(
    () => availableIcons.find((i) => i.name === icon),
    [icon]
  );

  if (!foundIcon) return null;

  return (
    <foundIcon.icon className="w-6 h-6 aspect-square text-foreground/70" />
  );
}
