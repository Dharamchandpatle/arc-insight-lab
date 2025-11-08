import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface CandidateCardProps {
  candidate: string;
  role: string;
  date: string;
  time: string;
  status: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, role, date, time, status }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${candidate}`} />
            <AvatarFallback>{candidate.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm font-medium">{candidate}</CardTitle>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <p className="text-muted-foreground">{date} at {time}</p>
          <span className={`px-2 py-1 rounded-full text-xs ${
            status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;