import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Users, FileText, DollarSign } from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatCurrency } from "@/lib/utils";

export const StatsSection: React.FC = () => {
  const { loanBookQuery } = useDashboardData();
  const { data: stats, error, isLoading } = loanBookQuery;

  const [isRevealed, setIsRevealed] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!stats) return <div>No data</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            LOAN BOOK VALUE
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isRevealed ? (
            <div className="animate-in fade-in duration-300 w-80">
              <div className="flex justify-between items-center gap-4">
                <div className="text-3xl font-bold text-foreground">
                  {formatCurrency(stats.totalValue)}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-6 px-0 text-xs text-muted-foreground hover:text-primary"
                  onClick={() => setIsRevealed(false)}
                >
                  <EyeOff className="mr-1 h-3 w-3" /> Hide Value
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated {stats.lastUpdated}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-between space-y-2 w-80">
              <div className="flex justify-between items-center gap-4">
                <div className="h-9 w-32 bg-gray-200 dark:bg-slate-700 animate-pulse rounded" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-6 px-0 text-xs text-muted-foreground hover:text-primary"
                  onClick={() => setIsRevealed(true)}
                >
                  <Eye className="mr-1 h-4 w-4" /> Reveal Value
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Current total loan book value
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            LOANS
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-sky-500">
            {stats.loanCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Active loan applications
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            CLIENTS
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-sky-500">
            {stats.clientCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total active clients
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
