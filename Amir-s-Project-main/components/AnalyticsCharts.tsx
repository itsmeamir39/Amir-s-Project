import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const borrowingTrend = [
  { month: "Sep", books: 320 }, { month: "Oct", books: 380 },
  { month: "Nov", books: 420 }, { month: "Dec", books: 280 },
  { month: "Jan", books: 450 }, { month: "Feb", books: 510 },
  { month: "Mar", books: 480 },
];

const categoryData = [
  { name: "Software", value: 2840, fill: "hsl(35, 80%, 52%)" },
  { name: "Fiction", value: 3200, fill: "hsl(220, 30%, 22%)" },
  { name: "Non-Fiction", value: 2100, fill: "hsl(142, 60%, 40%)" },
  { name: "Self-Help", value: 1800, fill: "hsl(210, 80%, 52%)" },
  { name: "Science", value: 1400, fill: "hsl(38, 92%, 50%)" },
  { name: "History", value: 1507, fill: "hsl(0, 72%, 51%)" },
];

const overdueData = [
  { week: "W1", overdue: 12, returned: 45 }, { week: "W2", overdue: 18, returned: 52 },
  { week: "W3", overdue: 8, returned: 48 }, { week: "W4", overdue: 22, returned: 40 },
  { week: "W5", overdue: 15, returned: 55 }, { week: "W6", overdue: 10, returned: 60 },
];

const userActivityData = [
  { day: "Mon", active: 180 }, { day: "Tue", active: 220 },
  { day: "Wed", active: 250 }, { day: "Thu", active: 200 },
  { day: "Fri", active: 310 }, { day: "Sat", active: 140 },
  { day: "Sun", active: 90 },
];

const fineCollectionData = [
  { month: "Sep", collected: 120, pending: 45 }, { month: "Oct", collected: 180, pending: 60 },
  { month: "Nov", collected: 150, pending: 35 }, { month: "Dec", collected: 90, pending: 80 },
  { month: "Jan", collected: 200, pending: 50 }, { month: "Feb", collected: 240, pending: 30 },
  { month: "Mar", collected: 210, pending: 25 },
];

const chartCard = "glass-card rounded-xl p-6";

export const BorrowingTrendChart = () => (
  <div className={chartCard}>
    <h3 className="font-display font-semibold text-foreground mb-4">Books Borrowed Over Time</h3>
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={borrowingTrend}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
        <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(40, 15%, 88%)", fontSize: 13 }} />
        <Area type="monotone" dataKey="books" stroke="hsl(35, 80%, 52%)" fill="hsl(35, 80%, 52%)" fillOpacity={0.15} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const CategoryChart = () => (
  <div className={chartCard}>
    <h3 className="font-display font-semibold text-foreground mb-4">Popular Categories</h3>
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
          {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(40, 15%, 88%)", fontSize: 13 }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export const OverdueTrendChart = () => (
  <div className={chartCard}>
    <h3 className="font-display font-semibold text-foreground mb-4">Overdue vs Returns</h3>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={overdueData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
        <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
        <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(40, 15%, 88%)", fontSize: 13 }} />
        <Legend />
        <Bar dataKey="returned" fill="hsl(142, 60%, 40%)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="overdue" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const UserActivityChart = () => (
  <div className={chartCard}>
    <h3 className="font-display font-semibold text-foreground mb-4">User Activity</h3>
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={userActivityData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
        <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
        <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(40, 15%, 88%)", fontSize: 13 }} />
        <Line type="monotone" dataKey="active" stroke="hsl(210, 80%, 52%)" strokeWidth={2} dot={{ fill: "hsl(210, 80%, 52%)", r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const FineCollectionChart = () => (
  <div className={chartCard}>
    <h3 className="font-display font-semibold text-foreground mb-4">Fine Collection</h3>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={fineCollectionData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
        <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(40, 15%, 88%)", fontSize: 13 }} />
        <Legend />
        <Bar dataKey="collected" fill="hsl(142, 60%, 40%)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="pending" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
