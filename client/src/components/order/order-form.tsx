import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Service } from "@shared/schema";
import { useOrders } from "@/hooks/use-orders";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Camera, Minus, Plus } from "lucide-react";

interface OrderFormProps {
  selectedService: Service;
}

export function OrderForm({ selectedService }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTimeSlot, setPickupTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  
  const { createOrder, isCreating } = useOrders();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const timeSlots = ["9:00 AM", "1:00 PM", "5:00 PM", "7:00 PM"];

  const calculateTotal = () => {
    const serviceFee = 2.00;
    let subtotal = 0;
    
    if (selectedService.pricingUnit === 'lb') {
      subtotal = quantity * Number(selectedService.pricePerLb);
    } else {
      subtotal = quantity * Number(selectedService.pricePerItem);
    }
    
    return {
      subtotal,
      serviceFee,
      total: subtotal + serviceFee,
    };
  };

  const handleSubmit = async () => {
    if (!pickupDate || !pickupTimeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select pickup date and time",
        variant: "destructive",
      });
      return;
    }

    const { subtotal, serviceFee, total } = calculateTotal();
    
    const orderData = {
      serviceId: selectedService.id,
      quantity: quantity.toString(),
      subtotal: subtotal.toString(),
      serviceFee: serviceFee.toString(),
      total: total.toString(),
      pickupDate: new Date(pickupDate + 'T00:00:00'),
      pickupTimeSlot,
      notes: notes || undefined,
      photos: photos.length > 0 ? photos : undefined,
    };

    try {
      const order = await new Promise((resolve, reject) => {
        createOrder(orderData, {
          onSuccess: resolve,
          onError: reject,
        });
      });
      
      // Navigate to checkout with order ID
      navigate(`/checkout?orderId=${(order as any).id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    }
  };

  const { subtotal, serviceFee, total } = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Selected Service */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Selected Service</h3>
        <div className="service-card selected">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mr-3">
              <i className="fas fa-magic text-emerald-600"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground" data-testid="selected-service-name">
                {selectedService.name}
              </h4>
              <p className="text-primary font-semibold" data-testid="selected-service-price">
                ${selectedService.pricingUnit === 'lb' ? selectedService.pricePerLb : selectedService.pricePerItem}/{selectedService.pricingUnit}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quantity Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {selectedService.pricingUnit === 'lb' ? 'Weight' : 'Quantity'}
        </h3>
        <div className="flex items-center justify-center space-x-6">
          <Button
            data-testid="button-decrease-quantity"
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full"
            onClick={() => setQuantity(Math.max(1, quantity - 0.5))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground" data-testid="text-quantity">
              {quantity}
            </p>
            <p className="text-muted-foreground">{selectedService.pricingUnit}s</p>
          </div>
          <Button
            data-testid="button-increase-quantity"
            size="icon"
            className="w-12 h-12 rounded-full"
            onClick={() => setQuantity(quantity + 0.5)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Photo Upload */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Upload Photos (Optional)</h3>
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <Camera className="mx-auto text-3xl text-muted-foreground mb-4" size={48} />
          <p className="text-muted-foreground mb-4">Take photos of your items</p>
          <Button
            data-testid="button-add-photos"
            variant="outline"
          >
            Add Photos
          </Button>
        </div>
      </Card>

      {/* Schedule Pickup */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Schedule Pickup</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date</label>
            <Input
              data-testid="input-pickup-date"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Time Slot</label>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  data-testid={`button-timeslot-${slot.replace(/[: ]/g, '-').toLowerCase()}`}
                  variant={pickupTimeSlot === slot ? "default" : "outline"}
                  onClick={() => setPickupTimeSlot(slot)}
                  className="py-3"
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Order Summary */}
      <Card className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between" data-testid="order-summary-service">
            <span>{selectedService.name} ({quantity} {selectedService.pricingUnit}s)</span>
            <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between" data-testid="order-summary-fee">
            <span>Service Fee</span>
            <span data-testid="text-service-fee">${serviceFee.toFixed(2)}</span>
          </div>
          <div className="border-t border-white/20 pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold" data-testid="order-summary-total">
              <span>Total</span>
              <span data-testid="text-total">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <Button
        data-testid="button-proceed-payment"
        onClick={handleSubmit}
        disabled={isCreating}
        className="w-full py-4 text-lg font-semibold"
      >
        {isCreating ? "Creating Order..." : "Proceed to Payment"}
      </Button>
    </div>
  );
}
