import { Button } from '@/components/Button';
import { Card } from '@/components/FormElements';

export function OrderHelpCard() {
  return (
    <Card className="border border-blue-200 bg-blue-50">
      <p className="mb-2 font-semibold">Need Help?</p>
      <p className="mb-4 text-sm text-gray-700">
        If you have any questions about your order, please contact our customer support team.
      </p>
      <Button variant="outline" className="text-sm">
        Contact Support
      </Button>
    </Card>
  );
}
