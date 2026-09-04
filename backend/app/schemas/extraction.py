from pydantic import BaseModel, Field
from typing import List, Optional

class Person(BaseModel):
    id: str = Field(description="Unique ID, e.g., p_001")
    name: str
    risk_score: int = Field(description="Estimated risk 0-100 based on FIR context")
    hierarchy_tier: str = Field(description="E.g., Kingpin, Associate, Mule")
    is_kingpin: bool

class Object(BaseModel):
    id: str = Field(description="Unique ID, e.g., obj_001")
    type: str = Field(description="Must be 'Phone', 'Vehicle', 'BankAccount', or 'Weapon'")
    identifier_value: str = Field(description="License plate, IMEI, phone number, or account number")
    is_burner: bool

class Location(BaseModel):
    id: str
    address: str
    lat: Optional[float]
    lng: Optional[float]
    tower_id: Optional[str]

class Event(BaseModel):
    id: str
    type: str = Field(description="E.g., FIR_Filing, Arrest, Raid. DO NOT use for phone calls.")
    timestamp: Optional[str]
    duration: Optional[str]
    amount: Optional[float]

class Organization(BaseModel):
    id: str
    name: str
    org_type: str

# NEW: Strictly defined properties instead of a generic dictionary
class RelationProperties(BaseModel):
    timestamp: Optional[str] = Field(default=None, description="Time of the call or transaction")
    duration: Optional[str] = Field(default=None, description="Duration of the call")
    amount: Optional[float] = Field(default=None, description="Amount of money transferred")

class Relationship(BaseModel):
    source_id: str
    target_id: str
    relation_type: str = Field(description="Must be strictly: ASSOCIATED_WITH, ALIAS_OF, DIRECTS, OWNS, USES, OPERATES, AFFILIATED_WITH, INVOLVED_IN, OCCURRED_AT, or CALLED")
    properties: RelationProperties

class GraphExtraction(BaseModel):
    persons: List[Person]
    objects: List[Object]
    locations: List[Location]
    events: List[Event]
    organizations: List[Organization]
    relationships: List[Relationship]