import { Card } from "@/components/ui/card";
import { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onClick?: () => void;
}

export function ServiceCard({ service, selected = false, onClick }: ServiceCardProps) {
  const getServiceIcon = (name: string) => {
    if (name.toLowerCase().includes('wash') && name.toLowerCase().includes('iron')) {
      return "fas fa-magic";
    } else if (name.toLowerCase().includes('dry cleaning')) {
      return "fas fa-crown";
    }
    return "fas fa-tshirt";
  };

  const getServiceColor = (name: string) => {
    if (name.toLowerCase().includes('wash') && name.toLowerCase().includes('iron')) {
      return "from-emerald-100 to-emerald-200 text-emerald-600";
    } else if (name.toLowerCase().includes('dry cleaning')) {
      return "from-amber-100 to-amber-200 text-amber-600";
    }
    return "from-blue-100 to-blue-200 text-blue-600";
  };

  const formatPrice = (service: Service) => {
    if (service.pricingUnit === 'lb') {
      return `$${service.pricePerLb}/lb`;
    }
    return `$${service.pricePerItem}/item`;
  };

  return (
    <Card 
      data-testid={`service-card-${service.id}`}
      className={`service-card cursor-pointer transition-all ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center p-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${getServiceColor(service.name)} rounded-xl flex items-center justify-center mr-4`}>
          <i className={`${getServiceIcon(service.name)} text-xl`}></i>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground" data-testid={`service-name-${service.id}`}>
            {service.name}
          </h4>
          <p className="text-muted-foreground text-sm" data-testid={`service-description-${service.id}`}>
            {service.description}
          </p>
          <p className="text-primary font-semibold text-lg" data-testid={`service-price-${service.id}`}>
            {formatPrice(service)}
          </p>
        </div>
        <i className="fas fa-chevron-right text-muted-foreground"></i>
      </div>
    </Card>
  );
}
