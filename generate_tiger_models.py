import math
from pathlib import Path

OUT = Path('models')
OUT.mkdir(exist_ok=True)

class Mesh:
    def __init__(self):
        self.v=[]
        self.f=[]
    def add_v(self,x,y,z):
        self.v.append((x,y,z)); return len(self.v)
    def add_face(self,idxs):
        self.f.append(tuple(idxs))
    def add_box(self,cx,cy,cz,sx,sy,sz):
        x0,x1=cx-sx/2,cx+sx/2
        y0,y1=cy-sy/2,cy+sy/2
        z0,z1=cz-sz/2,cz+sz/2
        ids=[
            self.add_v(x0,y0,z0),self.add_v(x1,y0,z0),self.add_v(x1,y1,z0),self.add_v(x0,y1,z0),
            self.add_v(x0,y0,z1),self.add_v(x1,y0,z1),self.add_v(x1,y1,z1),self.add_v(x0,y1,z1),
        ]
        quads=[(0,1,2,3),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
        for q in quads: self.add_face([ids[i] for i in q])

    def add_cylinder_x(self,cx,cy,cz,r,l,seg,caps=False):
        rings=[]
        for sx in (-l/2,l/2):
            ring=[]
            x=cx+sx
            for i in range(seg):
                a=2*math.pi*i/seg
                ring.append(self.add_v(x,cy+r*math.cos(a),cz+r*math.sin(a)))
            rings.append(ring)
        for i in range(seg):
            n=(i+1)%seg
            self.add_face([rings[0][i],rings[1][i],rings[1][n],rings[0][n]])
        if caps:
            c0=self.add_v(cx-l/2,cy,cz); c1=self.add_v(cx+l/2,cy,cz)
            for i in range(seg):
                n=(i+1)%seg
                self.add_face([c0,rings[0][n],rings[0][i]])
                self.add_face([c1,rings[1][i],rings[1][n]])

    def write_obj(self,path):
        with open(path,'w') as f:
            f.write('# Tiger tank inspired mesh\n')
            for x,y,z in self.v:
                f.write(f'v {x:.6f} {y:.6f} {z:.6f}\n')
            for face in self.f:
                f.write('f '+' '.join(map(str,face))+'\n')

def build_low():
    m=Mesh()
    m.add_box(0,0,0.6,6.4,2.6,1.2) # hull
    m.add_box(-0.8,0,1.45,3.0,2.0,0.9) # turret
    m.add_cylinder_x(1.8,0,1.55,0.11,5.2,8,caps=False) # gun
    # simplified tracks
    m.add_box(0,1.45,0.45,6.5,0.5,0.9)
    m.add_box(0,-1.45,0.45,6.5,0.5,0.9)
    return m

def build_high():
    m=Mesh()
    # main hull and upper hull
    m.add_box(0,0,0.7,6.7,3.0,1.4)
    m.add_box(-0.2,0,1.55,5.0,2.5,0.8)
    # turret + cupola
    m.add_box(-1.0,0,2.2,3.2,2.2,0.9)
    m.add_cylinder_x(-2.2,0,2.7,0.35,0.5,24,caps=True)
    # gun barrel + muzzle brake
    m.add_cylinder_x(1.4,0,2.2,0.13,6.8,28,caps=False)
    m.add_cylinder_x(4.6,0,2.2,0.18,0.6,28,caps=False)
    # side skirts/track guards
    m.add_box(0,1.65,1.05,6.1,0.22,0.4)
    m.add_box(0,-1.65,1.05,6.1,0.22,0.4)
    # road wheels interleaved approximation
    x_positions=[-2.6,-1.9,-1.2,-0.5,0.2,0.9,1.6,2.3]
    for side in (-1,1):
        y=side*1.45
        for i,x in enumerate(x_positions):
            z=0.48 if i%2==0 else 0.72
            m.add_cylinder_x(x,y,z,0.42,0.2,24,caps=True)
    # drive sprocket + idler
    for side in (-1,1):
        y=side*1.45
        m.add_cylinder_x(-3.0,y,0.62,0.55,0.24,28,caps=True)
        m.add_cylinder_x(2.8,y,0.62,0.5,0.24,28,caps=True)
    # simple continuous tracks as elongated boxes
    m.add_box(-0.1,1.45,0.55,6.5,0.35,1.0)
    m.add_box(-0.1,-1.45,0.55,6.5,0.35,1.0)
    return m

low=build_low(); high=build_high()
low.write_obj(OUT/'tiger_lowpoly.obj')
high.write_obj(OUT/'tiger_highpoly.obj')
print('written',OUT/'tiger_lowpoly.obj',OUT/'tiger_highpoly.obj')
print('low verts/faces',len(low.v),len(low.f))
print('high verts/faces',len(high.v),len(high.f))
