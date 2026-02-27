import { QuickAddDialog } from "./QuickAddDialog";
import { BookInventoryTable } from "./BookInventoryTable";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Filter, Download } from "lucide-react";
import { Button } from "./ui/button";

export function InventoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">
            Book Inventory
          </h1>
          <p className="text-muted-foreground">
            Manage your library's complete book collection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <QuickAddDialog />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Books</p>
                <p className="text-2xl font-semibold text-foreground">2,847</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-accent"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-semibold text-emerald-600">2,368</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Checked Out</p>
                <p className="text-2xl font-semibold text-amber-600">456</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-amber-600"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reserved</p>
                <p className="text-2xl font-semibold text-blue-600">23</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">All Books</CardTitle>
            <span className="text-sm text-muted-foreground">
              Last updated: Today, 2:45 PM
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <BookInventoryTable />
        </CardContent>
      </Card>
    </div>
  );
}
